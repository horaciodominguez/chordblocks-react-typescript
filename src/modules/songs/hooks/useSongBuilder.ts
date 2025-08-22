import { useReducer } from "react";
import { v4 as uuidv4 } from 'uuid'
import type {Song as SongType, SongSection} from "@/modules/songs/types/song.types";

const initialState: SongType = {
  id: uuidv4(),
  title: "",
  author: "",
  timeSignature: {
    beatsPerMeasure: 4,
    noteValue: 4
  },
  songSections: [] as SongSection[]
}

function reducer(state: typeof initialState, action: { type: string; payload: string }) {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_AUTHOR":
      return { ...state, author: action.payload };
    default:
      return state;
  }
}

export function useSongBuilder() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}



