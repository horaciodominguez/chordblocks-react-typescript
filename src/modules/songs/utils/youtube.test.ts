import { describe, it, expect } from "vitest"
import {
  parseYouTubeVideoId,
  isValidYouTubeUrl,
  parseTimeToSeconds,
  formatSeconds,
} from "@/modules/songs/utils/youtube"

describe("parseYouTubeVideoId", () => {
  it("parses standard watch URLs", () => {
    expect(
      parseYouTubeVideoId("https://www.youtube.com/watch?v=VArOUfVOjqI"),
    ).toBe("VArOUfVOjqI")
  })

  it("parses URLs without protocol and with extra params", () => {
    expect(parseYouTubeVideoId("youtube.com/watch?v=YNzuiRuQNYY&vl=es")).toBe(
      "YNzuiRuQNYY",
    )
  })

  it("parses youtu.be short links", () => {
    expect(parseYouTubeVideoId("https://youtu.be/1k8craCGpgs?t=42")).toBe(
      "1k8craCGpgs",
    )
  })

  it("parses embed and shorts paths", () => {
    expect(
      parseYouTubeVideoId("https://www.youtube.com/embed/1k8craCGpgs"),
    ).toBe("1k8craCGpgs")
    expect(parseYouTubeVideoId("https://youtube.com/shorts/1k8craCGpgs")).toBe(
      "1k8craCGpgs",
    )
  })

  it("parses music and mobile hosts", () => {
    expect(
      parseYouTubeVideoId("https://music.youtube.com/watch?v=gPAM0niKNto"),
    ).toBe("gPAM0niKNto")
    expect(parseYouTubeVideoId("m.youtube.com/watch?v=gPAM0niKNto")).toBe(
      "gPAM0niKNto",
    )
  })

  it("rejects non-YouTube or malformed URLs", () => {
    expect(
      parseYouTubeVideoId("https://www.cifraclub.com/madonna/la-isla-bonita/"),
    ).toBeNull()
    expect(parseYouTubeVideoId("https://youtube.com/watch?v=short")).toBeNull()
    expect(parseYouTubeVideoId("not a url")).toBeNull()
    expect(parseYouTubeVideoId("")).toBeNull()
  })

  it("isValidYouTubeUrl mirrors the parser", () => {
    expect(isValidYouTubeUrl("youtu.be/1k8craCGpgs")).toBe(true)
    expect(isValidYouTubeUrl("example.com/watch?v=1k8craCGpgs")).toBe(false)
  })
})

describe("parseTimeToSeconds", () => {
  it("parses m:ss", () => {
    expect(parseTimeToSeconds("3:41")).toBe(221)
    expect(parseTimeToSeconds("0:05")).toBe(5)
  })

  it("parses h:mm:ss", () => {
    expect(parseTimeToSeconds("1:02:35")).toBe(3755)
  })

  it("parses plain seconds", () => {
    expect(parseTimeToSeconds("95")).toBe(95)
  })

  it("rejects invalid values", () => {
    expect(parseTimeToSeconds("3:75")).toBeNull()
    expect(parseTimeToSeconds("abc")).toBeNull()
    expect(parseTimeToSeconds("")).toBeNull()
    expect(parseTimeToSeconds("-1:00")).toBeNull()
  })
})

describe("formatSeconds", () => {
  it("formats m:ss", () => {
    expect(formatSeconds(221)).toBe("3:41")
    expect(formatSeconds(5)).toBe("0:05")
  })

  it("formats h:mm:ss past one hour", () => {
    expect(formatSeconds(3755)).toBe("1:02:35")
  })

  it("round-trips with parseTimeToSeconds", () => {
    expect(parseTimeToSeconds(formatSeconds(83))).toBe(83)
  })
})
