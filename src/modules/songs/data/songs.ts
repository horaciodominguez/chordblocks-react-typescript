import { type Song } from "../types/song.types"

export const songsData: Song[] = [
  {
    id: "1",
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "G", duration: 4 }] },
          { id: "bar2", chords: [{ id: "c2", name: "D", duration: 4 }] },
          { id: "bar3", chords: [{ id: "c3", name: "Am", duration: 4 }] },
          {
            id: "bar4",
            chords: [
              { id: "c4", name: "G", duration: 2 },
              { id: "c5", name: "D", duration: 2 },
            ],
          },
        ],
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar5", chords: [{ id: "c6", name: "G", duration: 4 }] },
          { id: "bar6", chords: [{ id: "c7", name: "D", duration: 4 }] },
          { id: "bar7", chords: [{ id: "c8", name: "Am", duration: 4 }] },
          {
            id: "bar8",
            chords: [
              { id: "c9", name: "C", duration: 2 },
              { id: "c10", name: "G", duration: 2 },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "2",
    title: "Hallelujah",
    artist: "Leonard Cohen",
    timeSignature: { beatsPerMeasure: 6, noteValue: 8 }, // 6/8
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "C", duration: 6 }] },
          { id: "bar2", chords: [{ id: "c2", name: "Am", duration: 6 }] },
          {
            id: "bar3",
            chords: [
              { id: "c3", name: "C", duration: 3 },
              { id: "c4", name: "Am", duration: 3 },
            ],
          },
          { id: "bar4", chords: [{ id: "c5", name: "F", duration: 6 }] },
        ],
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar5", chords: [{ id: "c6", name: "C", duration: 6 }] },
          { id: "bar6", chords: [{ id: "c7", name: "F", duration: 6 }] },
          {
            id: "bar7",
            chords: [
              { id: "c8", name: "Am", duration: 3 },
              { id: "c9", name: "F", duration: 3 },
            ],
          },
          { id: "bar8", chords: [{ id: "c10", name: "G", duration: 6 }] },
        ],
      },
    ],
  },

  {
    id: "3",
    title: "Let It Be",
    artist: "The Beatles",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "C", duration: 4 }] },
          { id: "bar2", chords: [{ id: "c2", name: "G", duration: 4 }] },
          { id: "bar3", chords: [{ id: "c3", name: "Am", duration: 4 }] },
          { id: "bar4", chords: [{ id: "c4", name: "F", duration: 4 }] },
        ],
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          {
            id: "bar5",
            chords: [
              { id: "c5", name: "C", duration: 2 },
              { id: "c6", name: "G", duration: 2 },
            ],
          },
          { id: "bar6", chords: [{ id: "c7", name: "Am", duration: 4 }] },
          {
            id: "bar7",
            chords: [
              { id: "c8", name: "F", duration: 2 },
              { id: "c9", name: "C", duration: 2 },
            ],
          },
          { id: "bar8", chords: [{ id: "c10", name: "C", duration: 4 }] },
        ],
      },
    ],
  },

  {
    id: "b5954dbe-0293-44e1-bdb2-c74583380868",
    title: "Shape of You",
    artist: "Ed Sheeran",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: "018c433f-e386-4c79-b759-3c9ecec461ba",
        type: "INTRO",
        bars: [
          {
            id: "ec835990-e0f6-47cc-a4f2-36c6afe13107",
            chords: [
              {
                id: "3799fafa-904f-4056-897e-dc566a178ab3",
                name: "C#m",
                duration: 4,
              },
            ],
          },
          {
            id: "d4b089bc-f040-4cd7-b07d-bc5c30f64c81",
            chords: [
              {
                id: "386cf393-47ce-472a-aa3d-68e48a433b33",
                name: "F#m",
                duration: 4,
              },
            ],
          },
          {
            id: "c9cc9a68-327c-427e-b0d9-716c12518f3c",
            chords: [
              {
                id: "ef418a39-2275-4fe8-be71-0b24564cb240",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "6d43e3f4-9376-4519-9b61-ca366d0862a1",
            chords: [
              {
                id: "8e21bbac-c85b-4877-bc88-b03f4eb9c3f8",
                name: "B",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "28478e0c-1e56-4c39-802f-51a1ca3a6af6",
        type: "VERSE",
        bars: [
          {
            id: "86f9ddf9-7ed6-4b28-87cc-7b64acb75a7c",
            chords: [
              {
                id: "0c7b7b89-5ad4-4a4a-aecd-9e368ea2471a",
                name: "C#m",
                duration: 4,
              },
            ],
          },
          {
            id: "3ccaeb14-768b-4090-99d0-8a2a2c88be0f",
            chords: [
              {
                id: "51a87502-5f0b-4f12-bc05-adbc9897ec8c",
                name: "F#m",
                duration: 4,
              },
            ],
          },
          {
            id: "c689cedf-7f25-498f-91a0-36c7cfe0fc01",
            chords: [
              {
                id: "0e97d03d-4f80-4e9e-80b0-0b2061bc3cf3",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "c6d48150-3151-4f80-8937-3aa8b35f6c4a",
            chords: [
              {
                id: "8df01f1f-cdad-4d3e-99c7-18b0cb79befe",
                name: "B",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "7ac78cf5-7cdd-4cf3-99d4-13e69f42a84e",
        type: "PRE-CHORUS",
        bars: [
          {
            id: "92746d9d-3587-4ad7-ae11-c0a17e016fb4",
            chords: [
              {
                id: "e84ee949-279a-41f2-91ef-8e3a16c09c6a",
                name: "F#m",
                duration: 4,
              },
            ],
          },
          {
            id: "c2fbc86a-d4d9-46a4-83c1-fbde7c90a96c",
            chords: [
              {
                id: "f15a5e4e-13da-42fc-bf4a-1cfdd87efb3d",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "9c5824a4-b0c7-4b34-9492-fdc0a0b1e21f",
            chords: [
              {
                id: "f6e0a34f-1967-4685-9d78-f6ff53f2e37f",
                name: "B",
                duration: 4,
              },
            ],
          },
          {
            id: "0db54ab7-8f56-47f4-b6a1-3f28142d52cf",
            chords: [
              {
                id: "fa5a7c7e-4486-4ef8-9617-f44e8f4b9383",
                name: "C#m",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "f00f21a7-cb72-42e3-9cf1-fd9b3a4f9c54",
        type: "CHORUS",
        bars: [
          {
            id: "62a64a4a-3b38-4687-988c-30042d6cc702",
            chords: [
              {
                id: "40c67111-3009-4ff2-89ad-1d8b6f67e7cf",
                name: "C#m",
                duration: 4,
              },
            ],
          },
          {
            id: "6ff9dc4e-826f-46ec-a888-69abfe3d98b6",
            chords: [
              {
                id: "a020c05a-74e8-48b1-805c-6b01d8a11cd2",
                name: "F#m",
                duration: 4,
              },
            ],
          },
          {
            id: "fa7b9f95-58d9-4cf6-b3f8-9a4321c3b66e",
            chords: [
              {
                id: "ac9793f5-92bb-46b8-b0ac-49f6de173f25",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "b1566c57-8689-46d4-815c-6a7ed05e2525",
            chords: [
              {
                id: "5a4aaf57-7eb5-4414-9166-0bbed1085b8d",
                name: "B",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "0f3e8d3b-07a4-4523-81db-7f43a8fc5b9a",
        type: "BRIDGE",
        bars: [
          {
            id: "b2e4f7a6-df78-4d91-8d92-267ef9a71c2e",
            chords: [
              {
                id: "7c1f31a5-1432-47bb-b59d-89d6127d4d8d",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "77a327d7-fcd7-452c-bad2-74b8e2c3654f",
            chords: [
              {
                id: "0db9071e-bc6a-452f-8a9f-29a293e416ad",
                name: "B",
                duration: 4,
              },
            ],
          },
          {
            id: "c74051e5-7f2c-4c86-8d82-4f9d1987ef1e",
            chords: [
              {
                id: "2e1a03ec-69c1-4396-8ef1-498bb0181680",
                name: "C#m",
                duration: 4,
              },
            ],
          },
          {
            id: "1275b2ea-024f-4b83-b6f4-287aa6c1d122",
            chords: [
              {
                id: "54019363-3d6a-4efc-a006-bbb6c37ef90a",
                name: "F#m",
                duration: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "4",
    title: "La Cumparsita",
    artist: "Gerardo Matos Rodríguez",
    timeSignature: { beatsPerMeasure: 2, noteValue: 4 }, // 2/4 (tango clásico)
    songSections: [
      {
        id: "sec1",
        type: "INTRO",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "Am", duration: 2 }] },
          { id: "bar2", chords: [{ id: "c2", name: "E7", duration: 2 }] },
          { id: "bar3", chords: [{ id: "c3", name: "Am", duration: 2 }] },
          { id: "bar4", chords: [{ id: "c4", name: "E7", duration: 2 }] },
        ],
      },
      {
        id: "sec2",
        type: "VERSE",
        bars: [
          {
            id: "bar5",
            chords: [
              { id: "c5", name: "Am", duration: 1 },
              { id: "c6", name: "E7", duration: 1 },
            ],
          },
          { id: "bar6", chords: [{ id: "c7", name: "Am", duration: 2 }] },
          { id: "bar7", chords: [{ id: "c8", name: "Dm", duration: 2 }] },
          { id: "bar8", chords: [{ id: "c9", name: "E7", duration: 2 }] },
        ],
      },
    ],
  },

  {
    id: "2460460",
    title: "Let It Be",
    artist: "The Beatles",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "C", duration: 4 }] },
          { id: "bar2", chords: [{ id: "c2", name: "G", duration: 4 }] },
          { id: "bar3", chords: [{ id: "c3", name: "Am", duration: 4 }] },
          { id: "bar4", chords: [{ id: "c4", name: "F", duration: 4 }] },
        ],
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar5", chords: [{ id: "c5", name: "C", duration: 4 }] },
          { id: "bar6", chords: [{ id: "c6", name: "G", duration: 4 }] },
          { id: "bar7", chords: [{ id: "c7", name: "Am", duration: 4 }] },
          { id: "bar8", chords: [{ id: "c8", name: "F", duration: 4 }] },
        ],
      },
    ],
  },
  {
    id: "346794604",
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "INTRO",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "C", duration: 4 }] },
          { id: "bar2", chords: [{ id: "c2", name: "D", duration: 4 }] },
          { id: "bar3", chords: [{ id: "c3", name: "Am", duration: 4 }] },
          { id: "bar4", chords: [{ id: "c4", name: "G", duration: 4 }] },
        ],
      },
      {
        id: "sec2",
        type: "VERSE",
        bars: [
          { id: "bar5", chords: [{ id: "c5", name: "C", duration: 4 }] },
          { id: "bar6", chords: [{ id: "c6", name: "D", duration: 4 }] },
          { id: "bar7", chords: [{ id: "c7", name: "Am", duration: 4 }] },
          { id: "bar8", chords: [{ id: "c8", name: "G", duration: 4 }] },
        ],
      },
      {
        id: "sec3",
        type: "CHORUS",
        bars: [
          { id: "bar9", chords: [{ id: "c9", name: "Em", duration: 4 }] },
          { id: "bar10", chords: [{ id: "c10", name: "G", duration: 4 }] },
          { id: "bar11", chords: [{ id: "c11", name: "C", duration: 4 }] },
          { id: "bar12", chords: [{ id: "c12", name: "D", duration: 4 }] },
        ],
      },
    ],
  },
  {
    id: "49587057",
    title: "No Woman No Cry",
    artist: "Bob Marley",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "C", duration: 4 }] },
          { id: "bar2", chords: [{ id: "c2", name: "G", duration: 4 }] },
          { id: "bar3", chords: [{ id: "c3", name: "Am", duration: 4 }] },
          { id: "bar4", chords: [{ id: "c4", name: "F", duration: 4 }] },
        ],
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar5", chords: [{ id: "c5", name: "C", duration: 4 }] },
          { id: "bar6", chords: [{ id: "c6", name: "F", duration: 4 }] },
          { id: "bar7", chords: [{ id: "c7", name: "C", duration: 4 }] },
          { id: "bar8", chords: [{ id: "c8", name: "G", duration: 4 }] },
        ],
      },
    ],
  },
  {
    id: "457846795",
    title: "Stand By Me",
    artist: "Ben E. King",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "A", duration: 4 }] },
          { id: "bar2", chords: [{ id: "c2", name: "F#m", duration: 4 }] },
          { id: "bar3", chords: [{ id: "c3", name: "D", duration: 4 }] },
          { id: "bar4", chords: [{ id: "c4", name: "E", duration: 4 }] },
        ],
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar5", chords: [{ id: "c5", name: "A", duration: 4 }] },
          { id: "bar6", chords: [{ id: "c6", name: "F#m", duration: 4 }] },
          { id: "bar7", chords: [{ id: "c7", name: "D", duration: 4 }] },
          { id: "bar8", chords: [{ id: "c8", name: "E", duration: 4 }] },
        ],
      },
    ],
  },
  {
    id: "435634566",
    title: "Hotel California",
    artist: "Eagles",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 }, // 4/4
    songSections: [
      {
        id: "sec1",
        type: "VERSE",
        bars: [
          { id: "bar1", chords: [{ id: "c1", name: "Bm", duration: 4 }] },
          { id: "bar2", chords: [{ id: "c2", name: "F#", duration: 4 }] },
          { id: "bar3", chords: [{ id: "c3", name: "A", duration: 4 }] },
          { id: "bar4", chords: [{ id: "c4", name: "E", duration: 4 }] },
          { id: "bar5", chords: [{ id: "c5", name: "G", duration: 4 }] },
          { id: "bar6", chords: [{ id: "c6", name: "D", duration: 4 }] },
          { id: "bar7", chords: [{ id: "c7", name: "Em", duration: 4 }] },
          { id: "bar8", chords: [{ id: "c8", name: "F#", duration: 4 }] },
        ],
      },
      {
        id: "sec2",
        type: "CHORUS",
        bars: [
          { id: "bar9", chords: [{ id: "c9", name: "G", duration: 4 }] },
          { id: "bar10", chords: [{ id: "c10", name: "D", duration: 4 }] },
          { id: "bar11", chords: [{ id: "c11", name: "Em", duration: 4 }] },
          { id: "bar12", chords: [{ id: "c12", name: "Bm", duration: 4 }] },
          { id: "bar13", chords: [{ id: "c13", name: "C", duration: 4 }] },
          { id: "bar14", chords: [{ id: "c14", name: "G", duration: 4 }] },
          { id: "bar15", chords: [{ id: "c15", name: "Am", duration: 4 }] },
          { id: "bar16", chords: [{ id: "c16", name: "F#", duration: 4 }] },
        ],
      },
    ],
  },

  {
    id: "c7e7a708-5ef9-4e9f-97e0-1f7db7a57d0d",
    title: "Someone Like You",
    artist: "Adele",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: "5a01776f-2e0b-4991-89a3-19a93d0e69ee",
        type: "VERSE",
        bars: [
          {
            id: "20196b8d-33f1-42c1-9313-42d88932562f",
            chords: [
              {
                id: "27b73fa3-9b38-4908-9f2d-1275237b409e",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "68f6e92f-1e49-4261-bc44-7652214fc382",
            chords: [
              {
                id: "3127f72a-6575-46d4-890f-ff03027c5cc4",
                name: "E",
                duration: 4,
              },
            ],
          },
          {
            id: "3c573d16-6d92-4f14-8ed6-053b9e02eac7",
            chords: [
              {
                id: "b2e5f540-ccfd-41a5-8a9c-2f4d2e55878a",
                name: "F#m",
                duration: 4,
              },
            ],
          },
          {
            id: "8458942b-4ee2-44e6-b080-4c8bb42e51f6",
            chords: [
              {
                id: "c0d7d53d-40c7-4d52-8619-6165a960ae7b",
                name: "D",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "9fa06c02-6b7d-4973-94cd-9f2a4bdfc123",
        type: "PRE-CHORUS",
        bars: [
          {
            id: "c0194207-7f36-4f13-9cbb-5012dbe6e0e3",
            chords: [
              {
                id: "eaa81456-3db3-47e5-a1de-8a80ec851d6c",
                name: "Bm",
                duration: 4,
              },
            ],
          },
          {
            id: "3925c9e7-9a0a-47d2-8f3b-841c9a274205",
            chords: [
              {
                id: "de0f4ddc-f47b-4ee0-9a47-7b369aaf2c3f",
                name: "D",
                duration: 4,
              },
            ],
          },
          {
            id: "764db58c-0f2f-48df-8a8a-22a22f1f84a7",
            chords: [
              {
                id: "e6f19f0d-3a12-4e3b-8aa2-52ed68e82b95",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "6f8a4e1f-cc13-403e-8365-4734134d23a7",
            chords: [
              {
                id: "64b5f647-d4fc-41e6-bb43-507ec06e67d5",
                name: "E",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "678ebfaf-5f74-4459-bd8e-56d4dfd59ed0",
        type: "CHORUS",
        bars: [
          {
            id: "48f14316-f1ec-4f41-8ff1-6f8f0640a4a2",
            chords: [
              {
                id: "eebc1795-72ec-47cf-bc1a-5081cb43e18b",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "c640160a-1d85-46f5-9ac1-72ddf826c0e1",
            chords: [
              {
                id: "25adf5a7-812f-4c20-a116-f59a77e8a5f8",
                name: "E",
                duration: 4,
              },
            ],
          },
          {
            id: "9942d99e-3ebf-4e90-91d1-3c45715d65e2",
            chords: [
              {
                id: "78a6ee9a-baf8-4c93-83b0-fc4284b9c1af",
                name: "F#m",
                duration: 4,
              },
            ],
          },
          {
            id: "47143f24-fc55-42f4-b276-8f55ee08c1d0",
            chords: [
              {
                id: "cc14f674-c177-40cc-82f7-1f943f86732f",
                name: "D",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "15a0df20-0590-41af-977f-3d0f7b139059",
        type: "BRIDGE",
        bars: [
          {
            id: "8e8f7a55-560a-4a4b-8b84-496f83242cc3",
            chords: [
              {
                id: "a586962e-0015-4693-9376-891f62a96a5e",
                name: "Bm",
                duration: 4,
              },
            ],
          },
          {
            id: "c8f2c347-f179-4ccf-8e29-9d2fc59f9930",
            chords: [
              {
                id: "a8e6ff24-07ec-43b0-9e26-7c098f1899aa",
                name: "D",
                duration: 4,
              },
            ],
          },
          {
            id: "d8a8aa87-0917-4d65-b8c1-dc0b9d41f1cb",
            chords: [
              {
                id: "c6d0b9a3-8124-42a4-9eea-47c7b19a3a25",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "92908fc2-7294-4f7e-8946-fcbce87ff739",
            chords: [
              {
                id: "1a2f2273-bebc-4bc4-9a18-78134f270c94",
                name: "E",
                duration: 4,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "de7ad4d7-ec62-4201-9fd8-f88980ff9cf7",
    title: "Take Five",
    artist: "Dave Brubeck",
    timeSignature: { beatsPerMeasure: 5, noteValue: 4 },
    songSections: [
      {
        id: "5ad527d6-06a3-45c0-8d4c-2f3f6329a8f2",
        type: "INTRO",
        bars: [
          {
            id: "50e0cc1b-4d8c-4c86-8ee2-b924010f0f93",
            chords: [
              {
                id: "653a5403-3cdd-4009-aac7-8aa96db0d09f",
                name: "Ebm",
                duration: 5,
              },
            ],
          },
          {
            id: "fda7fcf1-3cc7-45c2-bf29-3b4c54b0dbd0",
            chords: [
              {
                id: "6f699a27-9fb8-44c4-9c87-26f885c7b4c5",
                name: "Bbm7",
                duration: 5,
              },
            ],
          },
        ],
      },
      {
        id: "c3bb09d3-158a-49fb-bb60-3f02b226f9b2",
        type: "VERSE",
        bars: [
          {
            id: "cc78f9de-569a-46d4-bcbf-5b78675cefa5",
            chords: [
              {
                id: "57f4fcbf-d0fc-4297-a222-bd781a38a053",
                name: "Ebm",
                duration: 5,
              },
            ],
          },
          {
            id: "ce23d3f7-053a-4498-9d54-35684d32734b",
            chords: [
              {
                id: "c74891bb-c0de-4d69-a5a9-1a9d23909a5c",
                name: "Bbm7",
                duration: 5,
              },
            ],
          },
        ],
      },
      {
        id: "6a87b046-5565-4f0d-a1a6-9f8b54051fa5",
        type: "INSTRUMENTAL",
        bars: [
          {
            id: "e76c27fc-cb02-4687-bd91-3a4f6d4df37a",
            chords: [
              {
                id: "a3d87b1c-3d57-439a-9b02-3f9f3a8d3ff9",
                name: "Ebm",
                duration: 5,
              },
            ],
          },
          {
            id: "67c496f3-8f58-4a38-a306-6f7b087ba44a",
            chords: [
              {
                id: "5d37f226-23be-4f6d-8c45-b2b0a850a146",
                name: "Bbm7",
                duration: 5,
              },
            ],
          },
        ],
      },
      {
        id: "1ef6a5b9-3bde-4740-861f-139bf0d2d93b",
        type: "OUTRO",
        bars: [
          {
            id: "e1f68053-0cf0-43f1-b4e9-4dfdfca3b8df",
            chords: [
              {
                id: "f8edebf3-b882-4eb0-9ef2-bbb2ad65d351",
                name: "Ebm",
                duration: 5,
              },
            ],
          },
          {
            id: "26d43f2b-6dd0-4c3e-b16e-1a3ac342fdf4",
            chords: [
              {
                id: "04e7b13d-c7d5-4cf8-8e32-6f9ee77f345f",
                name: "Bbm7",
                duration: 5,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "d35a5e93-bdd1-4e39-9188-36d13c9f94e7",
    title: "Money",
    artist: "Pink Floyd",
    timeSignature: { beatsPerMeasure: 7, noteValue: 4 },
    songSections: [
      {
        id: "89048e9c-2f1c-4902-95d3-6c4605af16df",
        type: "INTRO",
        bars: [
          {
            id: "8e2e7e16-b99f-44f0-b1ff-51127412f225",
            chords: [
              {
                id: "c8a1a428-8f67-4657-98f9-2787209f74b4",
                name: "Bm",
                duration: 7,
              },
            ],
          },
          {
            id: "64e9266b-75a2-49a1-bf16-6727f7b50d20",
            chords: [
              {
                id: "9b4422f3-5262-43e3-8e37-42ac3a2a6240",
                name: "F#m",
                duration: 7,
              },
            ],
          },
        ],
      },
      {
        id: "9b986a44-1b73-4f57-b2d6-7643b5c1ad0c",
        type: "VERSE",
        bars: [
          {
            id: "8b2a4d85-94c6-45c6-b26d-fecf53573a67",
            chords: [
              {
                id: "ca52bb7f-9b84-4907-9270-b9e2df3ccf41",
                name: "Bm",
                duration: 7,
              },
            ],
          },
          {
            id: "66df85f4-8e21-486e-b3af-8df232b7ff2f",
            chords: [
              {
                id: "dc4501f5-95b9-4ffb-b2f9-89fef45c7d5a",
                name: "A",
                duration: 7,
              },
            ],
          },
        ],
      },
      {
        id: "1a63d3d7-f7d3-4c22-a0dc-f7a20a6cdb35",
        type: "CHORUS",
        bars: [
          {
            id: "f2c863e7-8891-462e-a7e6-9390f6278e4d",
            chords: [
              {
                id: "3c31c315-1a10-4a06-85cf-4ea52763ef31",
                name: "E",
                duration: 7,
              },
            ],
          },
          {
            id: "6e76334b-7d3a-4e76-8f7e-4d496a2d18b2",
            chords: [
              {
                id: "47d1b4b1-4ef3-4bfb-bc66-367ab6af5c65",
                name: "G",
                duration: 7,
              },
            ],
          },
          {
            id: "04840e55-7f2a-4650-bf93-9fc48ad2cb12",
            chords: [
              {
                id: "1041826e-bd85-4481-949f-9fa482ad9ff6",
                name: "A",
                duration: 7,
              },
            ],
          },
          {
            id: "d7028ed3-8cb3-4c3b-b405-3306e4f5a63b",
            chords: [
              {
                id: "2e8b2a73-8db6-4c4a-bafe-80c417b26931",
                name: "Bm",
                duration: 7,
              },
            ],
          },
        ],
      },
      {
        id: "44d1aa29-3b3f-4c7e-8424-635e96c0b27c",
        type: "INSTRUMENTAL",
        bars: [
          {
            id: "5b8d3c55-30b1-4c68-bf42-5732f845a64c",
            chords: [
              {
                id: "39ef64f0-2eea-47b0-90a1-9ae358df6946",
                name: "Bm",
                duration: 7,
              },
            ],
          },
          {
            id: "2060539e-6e36-493d-9d3e-bb1ce8899b79",
            chords: [
              {
                id: "0b8f47c0-4687-456d-9a25-94bb2de3e72f",
                name: "F#m",
                duration: 7,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "e51b6805-235a-49d4-982d-00b5f2b43027",
    title: "Pyramid Song",
    artist: "Radiohead",
    timeSignature: { beatsPerMeasure: 4, noteValue: 4 },
    songSections: [
      {
        id: "49e9a5d7-b6f8-4d13-96e2-d33f89f3b7a3",
        type: "INTRO",
        bars: [
          {
            id: "35d8f7b7-2b29-46e6-ae53-c2a5c2e17872",
            chords: [
              {
                id: "24ab545c-cb0a-4683-9d6f-333ffb4f13f7",
                name: "F#m7",
                duration: 4,
              },
            ],
          },
          {
            id: "56a05ac1-198f-4b55-a68b-5b64c3a05ab6",
            chords: [
              {
                id: "58c5a62c-29a7-43f2-a3d4-190dc27603f9",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "15a4c5a3-810d-47ed-bc3d-2fc6db5a5c5f",
            chords: [
              {
                id: "8cd1e109-ef77-42b0-b6c4-9c38dfec4032",
                name: "E",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "9d4a545a-3ff6-4087-a9c2-89b97c4f6352",
        type: "VERSE",
        bars: [
          {
            id: "8e5b9a4a-2ff8-4930-b07a-40492d50d31a",
            chords: [
              {
                id: "c45a92fb-4719-47a2-99cc-22ac76817409",
                name: "F#m7",
                duration: 4,
              },
            ],
          },
          {
            id: "cb9f82d8-7dcf-4f4f-bf83-40a5a19fc92a",
            chords: [
              {
                id: "ba195f71-0b64-4823-a03f-63af7dd63baf",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "b870f26d-1a3a-4a7a-b206-ef62f055bbdb",
            chords: [
              {
                id: "4d28e5a3-1958-41b9-8c11-99bdeaba1c43",
                name: "E",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "6925be8d-8b9d-45dd-8bb2-96739ee7e3eb",
        type: "CHORUS",
        bars: [
          {
            id: "a912efc8-245d-4b78-8b18-ef91df184c6a",
            chords: [
              {
                id: "8cfbc3cd-1f1f-4d88-9f8c-4b3f9173d982",
                name: "Bm",
                duration: 4,
              },
            ],
          },
          {
            id: "c9428f90-785a-4d4f-87ad-29a5423f20f3",
            chords: [
              {
                id: "378fc6df-13f5-4998-84b3-52b1e43e46f4",
                name: "F#m7",
                duration: 4,
              },
            ],
          },
          {
            id: "0d7cd68f-0c77-4985-aaa7-8c1f6f82b3a7",
            chords: [
              {
                id: "fbc69b1b-2dd6-496e-9695-ff77673915c7",
                name: "E",
                duration: 4,
              },
            ],
          },
          {
            id: "7c62c29f-1f31-4f1a-9c77-4a77f1263f6d",
            chords: [
              {
                id: "5ea514cb-2296-41f6-8098-c42170b7e260",
                name: "A",
                duration: 4,
              },
            ],
          },
        ],
      },
      {
        id: "66566c18-62c1-4a7b-bd91-30d7cf15a6a6",
        type: "OUTRO",
        bars: [
          {
            id: "42c4f0f6-f7a0-42a5-8ff9-c5c7745fa35e",
            chords: [
              {
                id: "e8d22f13-9a65-4049-8d67-f16c06254a4b",
                name: "F#m7",
                duration: 4,
              },
            ],
          },
          {
            id: "4f6f5e20-5ab1-4d61-bf0d-c6cb4d8479f2",
            chords: [
              {
                id: "9a60a59f-31c1-42a1-a4ed-b8aa5ac8ad07",
                name: "A",
                duration: 4,
              },
            ],
          },
          {
            id: "1e7e1433-54c6-466f-a254-4a145af43a76",
            chords: [
              {
                id: "e49a7c66-22fb-47aa-94a4-40ec57916436",
                name: "E",
                duration: 4,
              },
            ],
          },
        ],
      },
    ],
  },
]
