import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"

import { 
    type Song as SongType,
    type TimeSignature, 
    type SongSection,
    type SectionType, 

    SECTION_OPTIONS, 
    beatsPerMeasureValues,
    noteValues,
    type SongChord,
    
} from "@/modules/songs/types/song.types"

import { SectionTag } from "@/modules/songs/components/SectionTag"

import { Chord } from "@/modules/chords/components/Chord"
import { chordsData } from "@/modules/chords/data/chords"




type Props = {
    handleAddSong: (NewSong: SongType) => void
}

export const SongForm = ({handleAddSong}: Props) => {

    //TITULO Y AUTOR 
    const [songValues, setSongValues] = useState<Partial<SongType>>({})

    //COMPÁS
    const [timeSignature, setTimeSignature] = useState<TimeSignature>({beatsPerMeasure: 4, noteValue: 4})
  
    //SECCIONES ACUMULADAS
    const [songSections, setSongSections]= useState<SongSection[]>([])

    // NUEVO: flujo para agregar sección con acorde inicial
    const [pendingSectionType, setPendingSectionType] = useState<SectionType | "">("")
    const [pendingChordName, setPendingChordName] = useState<string>("")
    const [pendingChords, setPendingChords] = useState<SongChord[]>([])
    const [pendingBeats, setPendingBeats] = useState<string>("4")

    //TITULO Y AUTOR INPUTS
    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        console.log(value)
        setSongValues({...songValues,[name]: value})
    }

    // COMPAS SELECTS
    const handleTimeSignature = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target
        setTimeSignature({...timeSignature,[name]: parseInt(value)})
    }

    const handleAddChord = () => {

        if (!pendingChordName || !pendingBeats) return

        const beatsNum = Math.max(1, parseInt(pendingBeats, 10) || 0)

        const newChord = {
            name: pendingChordName,
            beats: beatsNum
        }

        setPendingChords([...pendingChords,newChord])

    }

    // ADD SECTION AL ESTADO
    const handleAddSection = () => {

        if (!pendingSectionType || !pendingChords) return

        const newSection = {
            id: uuidv4(),
            type: pendingSectionType as SectionType,
            chords: pendingChords
        }

        setSongSections([...songSections,  newSection])

        setPendingSectionType("")
        setPendingChords([])
        setPendingBeats("4")

    }


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if(!songValues.title) {
            console.log("Debe ingresar un título")
            return
        }

        if(!songValues.author) {
            console.log("Debe ingresar un autor")
            return
        }

        const newSong = {
            id: uuidv4(),
            title: songValues.title ?? '',
            author: songValues.author ?? '',
            timeSignature: timeSignature,
            songSections: songSections
        }

        handleAddSong(newSong)
        
        setSongSections([])
        setSongValues({}) 
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <div className="mb-4">
                    {<Input name="title" label="Título" value={songValues.title ?? ""} onChange={handleChangeInput} />}
                </div>
                <div className="mb-4">
                    {<Input name="author" label="Autor" value={songValues.author ?? ""} onChange={handleChangeInput} />}
                </div>
                <div className="mb-4">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <Select 
                                name="beatsPerMeasure"
                                label="Figuras"
                                value={timeSignature.beatsPerMeasure}
                                onChange={handleTimeSignature}
                                options={beatsPerMeasureValues}
                            />
                        </div>
                        <div className="w-1/2">
                            <Select 
                                name="noteValue"
                                label="Notas"
                                value={timeSignature.noteValue}
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
                        value={pendingSectionType}
                        onChange={(e) => setPendingSectionType(e.target.value as SectionType) }
                    />
                    
                </div>
                {
                    pendingSectionType &&
                    <div className="mb-4">
                        <Select 
                            label="Acorde"
                            name="newChord"
                            options={ Object.keys(chordsData)}
                            value={pendingChordName}
                            onChange={(e) => setPendingChordName(e.target.value)}
                        />
                    </div>
                }
                {
                    (pendingSectionType && pendingChordName) &&
                    <div className="mb-4">
                        <Select
                            label="Beats:"
                            name="newBeats"
                            options={beatsPerMeasureValues}
                            value={pendingBeats}
                            onChange={(e) => setPendingBeats(e.target.value)}
                        />
                    </div>
                }
                {
                    (pendingSectionType && pendingChordName && pendingBeats) &&
                    <div className="mb-4">
                        <Button type="button" variant="secondary" onClick={handleAddChord}>Agregar acorde</Button>
                    </div>
                }
                {
                    (pendingSectionType && pendingChordName && pendingBeats && pendingChords) &&
                    <div className="mb-4">
                        <Button type="button" variant="secondary" onClick={handleAddSection}>Agregar Sección</Button>
                    </div>
                }

                
                {
                    songValues ?
                    
                    <div className="border-[.1px] border-gray-700 bg-gray-50/5 rounded-md p-4 shadow-sm"
                        >
                        <h3 className="font-medium">{songValues.title}</h3>
                        <p>{songValues.author}</p>
                        
                        <ul>
                        
                        {
                        songSections ?
                        songSections.map (
                            (section, sectionIndex) => (
            
                            <li key={sectionIndex} >
                                <SectionTag typeName={section.type} />
                                <div className="flex flex-wrap justify-items-start mb-2">
                                    {
                                        section.chords.map(
                                            (chord, i) => (
                                                <Chord key={i} timeSignature={timeSignature} chord={chord} />
                                            )
                                        )
                                    }
                                </div>
                            </li>
                            )
                        ) : ""
                        }
                        </ul>
                    </div>

                    : ""
                }
                    
                

                <div className="mb-4">
                    <Button type="submit">Agregar canción</Button>
                </div>
            </div>
        </form>
    )
}