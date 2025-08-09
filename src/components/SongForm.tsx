import { useRef, useState } from "react"

import { 
    type SectionType, 
    type TimeSignature, 
    type Song, 
    type SongSection, 
    SECTION_OPTIONS, 
    beatsPerMeasureValues,
    noteValues } from "../types/song"
import { v4 as uuidv4 } from 'uuid'
import Button from "./ui/Button"
import Input from "./ui/Input"
import { Select } from "./ui/Select"
import { SectionTag } from "./SectionTag"


type Props = {
    handleAddSong: (NewSong: Song) => void
}

export const SongForm = ({handleAddSong}: Props) => {

    const [songValues, setSongValues] = useState<Partial<Song>>({})
  
    const selectSection = useRef<HTMLSelectElement>(null)

    const [formSections, setFormSections]= useState<SongSection[]>([])

    const [timeSignature, setTimeSignature] = useState<TimeSignature>({
        beatsPerMeasure: 4,
        noteValue: 4
    })

    

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        console.log(value)
        setSongValues(
            {
                ...songValues,
                [name]: value
            }
        )
    }

    const handleAddSection = () => {

        const sectionValue = selectSection.current?.value as SectionType | ""
        if(!sectionValue) return

        const newSection = {
            id: uuidv4(),
            type: sectionValue as SectionType,
            blocks: []
        }

        setFormSections([...formSections,  newSection])

        if(selectSection.current){
            selectSection.current.value = ""
        }

    }

    const handleTimeSignature = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = event.target
        setTimeSignature(
            {...timeSignature,
            [name]: parseInt(value)}
        )
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
            songSections: formSections
        }

        handleAddSong(newSong)
        
        setFormSections([])
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
                    <Select 
                        name="beatsPerMeasure"
                        label="Figuras"
                        value={timeSignature.beatsPerMeasure}
                        onChange={handleTimeSignature}
                        options={beatsPerMeasureValues}
                    />
                </div>
                <div className="mb-4">
                    <Select 
                        name="noteValue"
                        label="Notas"
                        value={timeSignature.noteValue}
                        onChange={handleTimeSignature}
                        options={noteValues}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="formSongSections">Song Blocks:</label>
                    <select 
                        ref={selectSection}
                        id="formSongSections" 
                        defaultValue=""
                        onChange={handleAddSection}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Seleccione tipo de bloque</option>
                        {
                            SECTION_OPTIONS.map(
                                section => (<option key={section}>{section}</option>)
                            )
                        }
                    </select>

                    {/* <Select
                        name="formSongSections"
                        label="Song Block"
                        onChange={handleAddSection}
                        options={SECTION_OPTIONS}
                    /> */}
                    
                    {
                        <div className="py-4">
                        Secciones para agregar:
                        <ul>
                            {
                                formSections.map(
                                    formSection => (
                                        <SectionTag key={formSection.id} typeName={formSection.type} />
                                    )
                                )
                            }
                        </ul>
                        </div>
                    }
                    
                </div>
                <div className="mb-4">
                    <Button type="submit">Agregar canción</Button>
                </div>
            </div>
        </form>
    )
}