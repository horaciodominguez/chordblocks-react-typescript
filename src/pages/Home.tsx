import { type Song } from "../types/song"
import { songsMock } from "../data/songsMock"
import { useEffect, useState } from "react"
import { SongList } from "../components/SongList"



export default function Home() {

    const [songs, setSongs] = useState<Song[]>([])
  
    useEffect(()=>{
        setSongs(songsMock)
    }, [])

    

    return (
        <>
            <h2>Home</h2>
            <SongList songs={songs} />
        </>
    )
}