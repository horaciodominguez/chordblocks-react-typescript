import { useState } from "react"

import { type Song, type SectionType, SECTION_OPTIONS } from "../types/song"
import { v4 as uuidv4 } from 'uuid'
import Button from "./ui/Button"
import Input from "./ui/Input"


type Props = {
    handleAddSong: (NewSong: Song) => void
}

export const SongForm: React.FC<Props> = ({handleAddSong}) => {

    const [songValues, setSongValues] = useState<Partial<Song>>({})
  
    const [newSongSection, setNewSongSection] = useState<SectionType | "">("")
    const [formSections, setFormSections]= useState<SectionType[]>([])

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

    const handleChangeSections = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setNewSongSection(event.target.value as SectionType)
    }

    const handleAddSection = () => {
        if(!newSongSection) return
        setFormSections([
        ...formSections,
        newSongSection
        ])
        setNewSongSection("")
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
            songSections: formSections
        }

        handleAddSong(newSong)
        setNewSongSection("")
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
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="formSongSections">Song Blocks:</label>
                    <select 
                        value={newSongSection} 
                        id="formSongSections" 
                        onChange={handleChangeSections}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Seleccione tipo de bloque</option>
                        {
                            SECTION_OPTIONS.map(
                            section => (<option key={section}>{section}</option>)
                            )
                        }
                    </select>
                    
                    <div className="py-4">
                        Secciones para agregar:
                        <ul>
                            {
                            formSections.map(
                                (formSection, index) => (
                                <li 
                                className="inline-block bg-blue-100 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mt-1" 
                                key={index}>{formSection}</li>
                                )
                            )
                            }
                        </ul>
                    </div>
                    <Button onClick={handleAddSection}>Agregar sección</Button>
                    
                </div>
                <div className="mb-4">
                    <Button type="submit">Agregar canción</Button>
                </div>
            </div>
        </form>
    )
}