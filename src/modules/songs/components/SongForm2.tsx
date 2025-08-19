import { v4 as uuidv4 } from 'uuid'
import { useReducer } from "react";

import Input from "@/components/ui/Input";
import type { Song, SongSection } from "../types/song.types";

import Button from "@/components/ui/Button";

const initialState = {
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

type Props = {
  handleAddSong: (song: Song) => void;
};

export const SongForm2 = ({ handleAddSong }: Props) => {
  
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleAddSong(state);
    }}>
      <div className="flex flex-col gap-4">
          <div className="mb-4">
            <Input
              label="Title"
              name="title"
              onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
              value={state.title}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Author"
              name="author"
              onChange={(e) => dispatch({ type: "SET_AUTHOR", payload: e.target.value })}
              value={state.author}
            />
          </div>
          <div className="mb-4">
            <Button 
              type="submit"
              variant="primary"
            >Add Song</Button>
          </div>
      </div>
    </form>
  )
}

