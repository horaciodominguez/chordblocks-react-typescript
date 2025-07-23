import React, { useEffect, useState } from "react"
import { type Song, type SectionType, SECTION_OPTIONS } from "./types/song"
import {songsMockup} from "./data/songsMockup"
import { SongList } from "./components/SongList"


function App() {

  // STATES
  
  const [songs, setSongs] = useState<Song[]>([])
  const [newSongFormValues, setNewSongFormValues] = useState<Partial<Song>>({})

  const [newSongSection, setNewSongSection] = useState<SectionType | "">("")
  const [formSections, setFormSections]= useState<SectionType[]>([])
  
  
  // USEEFFECT
  useEffect(()=>{
    setSongs(songsMockup)
  }, [])

  // EVENTS
  const handleChangeTitle = (event:React.ChangeEvent<HTMLInputElement>) => {
    setNewSongFormValues(
      {
        ...newSongFormValues, 
        title: event.target.value
      }
    )
  }

  const handleChangeAuthor = (event:React.ChangeEvent<HTMLInputElement>) => {
    setNewSongFormValues(
      {
        ...newSongFormValues, 
        author: event.target.value
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

  const handleClickAdd = () => {

    if(!newSongFormValues.title) {
      console.log("Debe ingresar un título")
      return
    }

    if(!newSongFormValues.author) {
      console.log("Debe ingresar un autor")
      return
    }

    const newSong = {
      id: songs.length + 1,
      title: newSongFormValues.title ?? '',
      author: newSongFormValues.author ?? '',
      songSections: formSections
    }

    console.log(newSong)

    setSongs(
      [
        ...songs,
        newSong
      ]
    )

    setNewSongSection("")
    setFormSections([])
    setNewSongFormValues({})
    

  }

  // RETURN
  return (
    <>
      <h1>SongBlocks</h1>
      <SongList songs={songs} />
      <div>
        <h2>Agregar canción:</h2>
        <div>
          <div>
            <label htmlFor="formTitle">Título</label>
            <input value={newSongFormValues.title ?? ""} id="formTitle" type="text" onChange={handleChangeTitle} />
          </div>
          <div>
            <label htmlFor="formAuthor">Autor</label>
            <input value={newSongFormValues.author ?? ""} id="formAuthor" type="text" onChange={handleChangeAuthor} />
          </div>
          <div>
            <label htmlFor="formSongSections">Song Blocks:</label>
            <select value={newSongSection} id="formSongSections" onChange={handleChangeSections}>
              <option value="">Seleccione tipo de bloque</option>
              {
                SECTION_OPTIONS.map(
                  section => (<option key={section}>{section}</option>)
                )
              }
            </select>
            <div>Nueva sección: {newSongSection}</div>
            <div>
              Secciones para agregar:
              <ul>
                {
                  formSections.map(
                    (formSection, index) => (
                      <li key={index}>{formSection}</li>
                    )
                  )
                }
              </ul>
            </div>
            <button onClick={handleAddSection}>Agregar sección</button>
          </div>
          <div>
            <button onClick={handleClickAdd}>Agregar</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
