import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"

import { 
    type Song as SongType,
    type SongSection,
    type SectionType, 
    type Bar,
    SECTION_OPTIONS, 
    beatsPerMeasureValues,
    noteValues,
    type BarChord
    
} from "@/modules/songs/types/song.types"

import { chordsData } from "@/modules/chords/data/chords"
import { Song, type TemporarySong } from "@/modules/songs/components/Song"
import { SectionTag } from "@/modules/songs/components/SectionTag"
import { Sections } from "@/modules/songs/components/Sections"




type Props = {
    handleAddSong: (NewSong: SongType) => void
}

export const SongForm = ({handleAddSong}: Props) => {

    const initialSongState: TemporarySong = {
        id: uuidv4(),
        title: '',
        author: '',
        timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
        songSections: []
    }

    const getRemainingBeats = (bar: Omit<Bar, "id">, beatsPerMeasure: number) => {
        const used = bar.chords.reduce((acc, chord) => acc + chord.duration, 0)
        return beatsPerMeasure - used
    }


    //TITULO Y AUTOR 
    const [temporarySong, setTemporarySong] = useState<TemporarySong>(initialSongState)

    // SECCIONES
    const [pendingSection, setPendingSection] = useState<Omit<SongSection, 'id'>>({
        type: "" as SectionType,
        bars: []
    });

    //ACORDE
    const [pendingChordName, setPendingChordName] = useState<string>("")
    const [pendingBeats, setPendingBeats] = useState<string>("4")

    // ---------------- FUNCIONES --------------------

    //TITULO Y AUTOR INPUTS
    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setTemporarySong({...temporarySong,[name]: value})
    }

    // COMPAS SELECTS
    const handleTimeSignature = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target
        setTemporarySong({
            ...temporarySong,
            timeSignature: {
                ...temporarySong.timeSignature, 
                [name]: parseInt(value)
            }
        })
    }

    //SELECT SECTION TYPE
    const handleSelectSectionType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPendingSection(
            {
                ...pendingSection,
                type: event.target.value
            }
        )
    }

    const handleAddChord = () => {
        if (!pendingChordName || !pendingBeats) return

        const beatsNum = Math.max(1, parseInt(pendingBeats, 10) || 0)
        const bpm = temporarySong.timeSignature.beatsPerMeasure

        const newChord: BarChord = {
            id: uuidv4(),
            name: pendingChordName,
            duration: beatsNum,
        }

        const bars = pendingSection.bars
        const lastBar = bars[bars.length - 1]
        let updatedBars: Bar[]

        if (lastBar) {
            const remaining = getRemainingBeats(lastBar, bpm)
            if (beatsNum <= remaining) {
            // entra en el compás actual
            const updatedLastBar: Bar = {
                ...lastBar,
                chords: [...lastBar.chords, newChord],
            }
            updatedBars = [...bars.slice(0, -1), updatedLastBar]
            } else {
            // no entra -> arranca compás nuevo
            updatedBars = [
                ...bars,
                { id: uuidv4(), chords: [newChord] }
            ]
            }
        } else {
            // no hay compases aún -> creamos el primero
            updatedBars = [{ id: uuidv4(), chords: [newChord] }]
        }

        setPendingSection({
            ...pendingSection,
            bars: updatedBars,
        })

        // limpiar nombre acorde
        setPendingChordName("")

        // recalcular beats válidos para el próximo acorde
        const newBars = updatedBars
        const last = newBars[newBars.length - 1]
        const remaining = getRemainingBeats(last, bpm)
        const cap = remaining > 0 ? remaining : bpm
        const opts = beatsPerMeasureValues.filter(v => v <= cap)

        // si hay 4 en las opciones, usamos 4, sino usamos el mayor posible
        const nextBeats = opts.includes(4) ? 4 : opts[opts.length - 1]
        setPendingBeats(String(nextBeats))
    }



    // ADD SECTION AL ESTADO
    const handleAddSection = () => {

        if (!pendingSection.type || pendingSection.bars.length === 0) return;

        const newSection = {
            id: uuidv4(),
            ...pendingSection
        }

        setTemporarySong({
            ...temporarySong,
            songSections: [...temporarySong.songSections, newSection]
        });

        // Limpiar el estado de la sección pendiente para la próxima sección
        setPendingSection({
            type: "" as SectionType,
            bars: []
        });

    }
    

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!temporarySong.title || !temporarySong.author) {
            console.log("Debe ingresar un título y un autor");
            return;
        }

        // La canción ya está lista para ser enviada.
        // Asegúrate de que handleAddSong reciba un tipo 'SongType'
        handleAddSong(temporarySong as SongType);
        
        // Resetear el formulario después de enviar
        setTemporarySong(initialSongState); 
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <div className="mb-4">
                    {<Input name="title" label="Título" value={temporarySong.title ?? ""} onChange={handleChangeInput} />}
                </div>
                <div className="mb-4">
                    {<Input name="author" label="Autor" value={temporarySong.author ?? ""} onChange={handleChangeInput} />}
                </div>
                <div className="mb-4">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <Select 
                                name="beatsPerMeasure"
                                label="Figuras"
                                value={temporarySong.timeSignature.beatsPerMeasure}
                                onChange={handleTimeSignature}
                                options={beatsPerMeasureValues}
                            />
                        </div>
                        <div className="w-1/2">
                            <Select 
                                name="noteValue"
                                label="Notas"
                                value={temporarySong.timeSignature.noteValue}
                                onChange={handleTimeSignature}
                                options={noteValues}
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    
                    <Select 
                        label="Sección"
                        name="newSection"
                        options={SECTION_OPTIONS}
                        value={pendingSection.type}
                        onChange={handleSelectSectionType}
                    />
                    
                </div>
                {
                    pendingSection.type &&
                    <div className="mb-4">
                        <Select 
                            label="Acorde"
                            name="newChord"
                            options={ Object.keys(chordsData) }
                            value={pendingChordName}
                            onChange={(e) => setPendingChordName(e.target.value)}
                        />
                    </div>
                }
                {
                    (pendingSection.type && pendingChordName) &&
                    <div className="mb-4">
                        <Select
                            label="Beats:"
                            name="newBeats"
                            options={(() => {
                                const lastBar = pendingSection.bars.at(-1)
                                const bpm = temporarySong.timeSignature.beatsPerMeasure
                                const remaining = lastBar ? getRemainingBeats(lastBar, bpm) : bpm
                                const cap = remaining > 0 ? remaining : bpm
                                return beatsPerMeasureValues.filter(v => v <= cap)
                            })()}
                            value={pendingBeats}
                            onChange={(e) => setPendingBeats(e.target.value)}
                        />


                    </div>
                }
                {
                    (pendingSection.type && pendingChordName && pendingBeats) &&
                    <div className="mb-4">
                        <Button type="button" variant="secondary" onClick={handleAddChord}>Agregar acorde</Button>
                    </div>
                }
                

                {
                    (pendingSection.bars.length!==0) &&
                    <>
                        <h2>Temporary Section</h2>
                        <SectionTag typeName={pendingSection.type} />
                        <Sections section={pendingSection as SongSection} timeSignature={temporarySong.timeSignature} />
                        <div className="mb-4">
                            <Button type="button" variant="secondary" onClick={handleAddSection}>Agregar Sección</Button>
                        </div>
                    </>
                    
                }
                
                {
                    temporarySong && 
                    <>
                        <h2>Temporary Song</h2>
                        <Song song={temporarySong} />
                    </>
                }
                

                <div className="mb-4">
                    <Button type="submit">Agregar canción</Button>
                </div>
            </div>
        </form>
    )
}