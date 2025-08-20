[33mcommit 53cd511638ebbeaa40d21e161092f29107c780fb[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m)[m
Author: horaciodominguez <hord17@gmail.com>
Date:   Tue Aug 19 15:43:36 2025 -0300

    new form 2

[1mdiff --git a/src/modules/songs/components/SongForm2.tsx b/src/modules/songs/components/SongForm2.tsx[m
[1mnew file mode 100644[m
[1mindex 0000000..29352e9[m
[1m--- /dev/null[m
[1m+++ b/src/modules/songs/components/SongForm2.tsx[m
[36m@@ -0,0 +1,71 @@[m
[32m+[m[32mimport { v4 as uuidv4 } from 'uuid'[m
[32m+[m[32mimport { useReducer } from "react";[m
[32m+[m
[32m+[m[32mimport Input from "@/components/ui/Input";[m
[32m+[m[32mimport type { Song, SongSection } from "../types/song.types";[m
[32m+[m
[32m+[m[32mimport Button from "@/components/ui/Button";[m
[32m+[m
[32m+[m[32mconst initialState = {[m
[32m+[m[32m  id: uuidv4(),[m
[32m+[m[32m  title: "",[m
[32m+[m[32m  author: "",[m
[32m+[m[32m  timeSignature: {[m
[32m+[m[32m    beatsPerMeasure: 4,[m
[32m+[m[32m    noteValue: 4[m
[32m+[m[32m  },[m
[32m+[m[32m  songSections: [] as SongSection[][m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mfunction reducer(state: typeof initialState, action: { type: string; payload: string }) {[m
[32m+[m[32m  switch (action.type) {[m
[32m+[m[32m    case "SET_TITLE":[m
[32m+[m[32m      return { ...state, title: action.payload };[m
[32m+[m[32m    case "SET_AUTHOR":[m
[32m+[m[32m      return { ...state, author: action.payload };[m
[32m+[m[32m    default:[m
[32m+[m[32m      return state;[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32mtype Props = {[m
[32m+[m[32m  handleAddSong: (song: Song) => void;[m
[32m+[m[32m};[m
[32m+[m
[32m+[m[32mexport const SongForm2 = ({ handleAddSong }: Props) => {[m
[32m+[m[41m  [m
[32m+[m[32m  const [state, dispatch] = useReducer(reducer, initialState);[m
[32m+[m
[32m+[m[32m  return ([m
[32m+[m[32m    <form onSubmit={(e) => {[m
[32m+[m[32m      e.preventDefault();[m
[32m+[m[32m      handleAddSong(state);[m
[32m+[m[32m    }}>[m
[32m+[m[32m      <div className="flex flex-col gap-4">[m
[32m+[m[32m          <div className="mb-4">[m
[32m+[m[32m            <Input[m
[32m+[m[32m              label="Title"[m
[32m+[m[32m              name="title"[m
[32m+[m[32m              onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}[m
[32m+[m[32m              value={state.title}[m
[32m+[m[32m            />[m
[32m+[m[32m          </div>[m
[32m+[m[32m          <div className="mb-4">[m
[32m+[m[32m            <Input[m
[32m+[m[32m              label="Author"[m
[32m+[m[32m              name="author"[m
[32m+[m[32m              onChange={(e) => dispatch({ type: "SET_AUTHOR", payload: e.target.value })}[m
[32m+[m[32m              value={state.author}[m
[32m+[m[32m            />[m
[32m+[m[32m          </div>[m
[32m+[m[32m          <div className="mb-4">[m
[32m+[m[32m            <Button[m[41m [m
[32m+[m[32m              type="submit"[m
[32m+[m[32m              variant="primary"[m
[32m+[m[32m            >Add Song</Button>[m
[32m+[m[32m          </div>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    </form>[m
[32m+[m[32m  )[m
[32m+[m[32m}[m
[32m+[m
