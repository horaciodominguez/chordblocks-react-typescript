import Nav from "./Nav"

export function Header() {
  return (
    <>
      <h1 className="text-gray-200 text-3xl uppercase text-center p-6">
        <figure>
          <img
            src="./assets/logo.svg"
            alt="ChordBlocks logo"
            className="mx-auto"
            width={200}
          />
        </figure>
      </h1>
      <Nav />
    </>
  )
}
