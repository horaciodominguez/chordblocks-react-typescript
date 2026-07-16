import { type Song } from "../types/song.types"

export const songsData: Song[] = [
  {
    id: "01b106ea-5559-4294-8414-0cb674b0cfb3",
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    genre: "Folk Rock",
    year: 1973,
    imageUrl: null,
    imageBase64: null,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        type: "INTRO",
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000002",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000003",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000004",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000005",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000006",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000007",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000008",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000009",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000010",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000011",
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
      {
        id: "00000000-0000-4000-8000-000000000012",
        type: "VERSE", // Verso 1: "Mama take this badge off of me..."
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000013",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000014",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000015",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000016",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000017",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000018",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000019",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000020",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000021",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000022",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: "00000000-0000-4000-8000-000000000023",
        type: "CHORUS", // "Knock, knock, knockin' on heaven's door"
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000024",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000025",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000026",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000027",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000028",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000029",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000030",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000031",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000032",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000033",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: "00000000-0000-4000-8000-000000000034",
        type: "VERSE", // Verso 2: "Mama put my guns in the ground..."
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000035",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000036",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000037",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000038",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000039",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000040",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000041",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000042",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000043",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000044",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: "00000000-0000-4000-8000-000000000045",
        type: "CHORUS",
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000046",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000047",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000048",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000049",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000050",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000051",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000052",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000053",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000054",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000055",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: "00000000-0000-4000-8000-000000000056",
        type: "OUTRO", // Solo/Coros finales
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000057",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000058",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000059",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000060",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000061",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000062",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000063",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000064",
                type: "chord",
                chord: { name: "D" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000065",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000066",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 4,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },

  {
    id: "1e26b321-8d51-4b4b-9ce4-2cf596f87870",
    title: "Have You Ever Seen the Rain",
    artist: "Creedence Clearwater Revival",
    genre: "Roots Rock",
    year: 1971,
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: "00000000-0000-4000-8000-000000000067",
        type: "INTRO",
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000068",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000069",
                type: "chord",
                chord: { name: "Am" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000070",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000071",
                type: "chord",
                chord: { name: "F" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000072",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000073",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000074",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000075",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000076",
            position: 5,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000077",
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
      {
        id: "00000000-0000-4000-8000-000000000078",
        type: "VERSE", // "Someone told me long ago..."
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000079",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000080",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000081",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000082",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000083",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000084",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000085",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000086",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000087",
            position: 5,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000088",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000089",
            position: 6,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000090",
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
      {
        id: "00000000-0000-4000-8000-000000000091",
        type: "VERSE", // "Yesterday and days before..."
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000092",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000093",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000094",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000095",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000096",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000097",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000098",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000099",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000100",
            position: 5,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000101",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000102",
            position: 6,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000103",
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
      {
        id: "00000000-0000-4000-8000-000000000104",
        type: "CHORUS", // "I want to know, have you ever seen the rain?"
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000105",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000106",
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000107",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000108",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000109",
                type: "chord",
                chord: { name: "C" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000110",
                type: "chord",
                chord: { name: "Am" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000111",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000112",
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000113",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000114",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000115",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2, // Se repite dos veces por cada estribillo
      },
      {
        id: "00000000-0000-4000-8000-000000000116",
        type: "VERSE", // "Sun is shining on a cloudy day..."
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000117",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000118",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000119",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000120",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000121",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000122",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000123",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000124",
                type: "chord",
                chord: { name: "G" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000125",
            position: 5,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000126",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000127",
            position: 6,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000128",
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
      {
        id: "00000000-0000-4000-8000-000000000129",
        type: "CHORUS", // Repetición del estribillo tras el tercer verso
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000130",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000131",
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000132",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000133",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000134",
                type: "chord",
                chord: { name: "C" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000135",
                type: "chord",
                chord: { name: "Am" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000136",
            position: 3,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000137",
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000138",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000139",
            position: 4,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000140",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
      {
        id: "00000000-0000-4000-8000-000000000141",
        type: "OUTRO",
        bars: [
          {
            id: "00000000-0000-4000-8000-000000000142",
            position: 1,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000143",
                type: "chord",
                chord: { name: "F" },
                duration: 2,
                position: 1,
              },
              {
                id: "00000000-0000-4000-8000-000000000144",
                type: "chord",
                chord: { name: "G" },
                duration: 2,
                position: 2,
              },
            ],
          },
          {
            id: "00000000-0000-4000-8000-000000000145",
            position: 2,
            blocks: [
              {
                id: "00000000-0000-4000-8000-000000000146",
                type: "chord",
                chord: { name: "C" },
                duration: 4,
                position: 1,
              },
            ],
          },
        ],
        repeats: 2,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
]
