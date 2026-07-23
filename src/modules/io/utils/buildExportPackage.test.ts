import { describe, expect, it } from "vitest"
import { buildExportPackage } from "./buildExportPackage"
import {
  cloneRepertoireWithSongMap,
  findSongConflicts,
  prepareSongImports,
} from "./importPackage"
import { normalizeSongTitle } from "./normalizeTitle"
import type { Song } from "@/modules/songs/types/song.types"
import type { Repertoire } from "@/modules/repertoires/types/repertoire.types"

function stubSong(partial: Partial<Song> & Pick<Song, "id" | "title">): Song {
  return {
    artist: "Artist",
    genre: "Rock",
    year: 2000,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    imageUrl: null,
    imageBase64: null,
    songSections: [
      {
        id: "sec-1",
        type: "VERSE",
        bars: [
          {
            id: "bar-1",
            position: 1,
            blocks: [
              {
                id: "blk-1",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 1,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...partial,
  }
}

const songA = stubSong({ id: "a", title: "Valerie" })
const songB = stubSong({ id: "b", title: "Billie Jean" })

const repertoire: Repertoire = {
  id: "rep-1",
  title: "Noche X",
  groups: [
    {
      id: "g1",
      title: "English",
      items: [
        { id: "i1", songId: "a", transposeSemitones: 0 },
        { id: "i2", songId: "b", transposeSemitones: 1 },
        { id: "i3", songId: "a", transposeSemitones: 0 },
      ],
    },
  ],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}

describe("normalizeSongTitle", () => {
  it("trims and lowercases", () => {
    expect(normalizeSongTitle("  Valerie  ")).toBe("valerie")
  })
})

describe("buildExportPackage", () => {
  it("dedupes songs by id", () => {
    const pkg = buildExportPackage({ songs: [songA, songA, songB] })
    expect(pkg.songs).toHaveLength(2)
    expect(pkg.version).toBe(1)
  })

  it("includes repertoire songs once from library", () => {
    const pkg = buildExportPackage({
      repertoires: [repertoire],
      allSongs: [songA, songB],
    })
    expect(pkg.songs).toHaveLength(2)
    expect(pkg.repertoires).toHaveLength(1)
  })
})

describe("findSongConflicts / prepareSongImports", () => {
  it("detects same title", () => {
    const local = [stubSong({ id: "local-a", title: "Valerie" })]
    const conflicts = findSongConflicts([songA], local)
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0].localSong.id).toBe("local-a")
  })

  it("maps skip to local id and duplicate to new id", () => {
    const local = [stubSong({ id: "local-a", title: "Valerie" })]
    const { prepared, songIdMap } = prepareSongImports([songA, songB], local, [
      { packageSongId: "a", action: "skip" },
      { packageSongId: "b", action: "duplicate" },
    ])
    expect(songIdMap.get("a")).toBe("local-a")
    expect(songIdMap.get("b")).not.toBe("b")
    expect(prepared.find((p) => p.packageSongId === "a")?.mode).toBe("skip")
    expect(prepared.find((p) => p.packageSongId === "b")?.mode).toBe("add")
  })

  it("replace keeps local id", () => {
    const local = [stubSong({ id: "local-a", title: "Valerie" })]
    const { prepared, songIdMap } = prepareSongImports([songA], local, [
      { packageSongId: "a", action: "replace" },
    ])
    expect(songIdMap.get("a")).toBe("local-a")
    expect(prepared[0].mode).toBe("update")
    expect(prepared[0].song?.id).toBe("local-a")
  })
})

describe("cloneRepertoireWithSongMap", () => {
  it("remaps song ids and regenerates entity ids", () => {
    const map = new Map([
      ["a", "new-a"],
      ["b", "new-b"],
    ])
    const cloned = cloneRepertoireWithSongMap(repertoire, map)
    expect(cloned.id).not.toBe(repertoire.id)
    expect(cloned.groups[0].items.map((i) => i.songId)).toEqual([
      "new-a",
      "new-b",
      "new-a",
    ])
  })
})
