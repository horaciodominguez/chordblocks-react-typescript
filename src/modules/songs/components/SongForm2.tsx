


import Input from "@/components/ui/Input";
import type { Song } from "../types/song.types";

import Button from "@/components/ui/Button";

import { useSongBuilder } from "../hooks/useSongBuilder";


type Props = {
  handleAddSong: (song: Song) => void;
};

export const SongForm2 = ({ handleAddSong }: Props) => {
  const { state, dispatch } = useSongBuilder();

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

