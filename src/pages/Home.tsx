import PageTitle from "@/components/ui/PageTitle"
import { SongList } from "@/modules/songs/components/SongList"

export default function Home() {
  return (
    <>
      <PageTitle>Songs</PageTitle>
      <SongList />
    </>
  )
}
