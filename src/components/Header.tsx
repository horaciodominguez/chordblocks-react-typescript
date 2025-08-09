import { Link } from "react-router-dom";

export function Header () {
    return (
        <>
            <h1 className="text-gray-200 text-3xl uppercase text-center p-6">SongBlocks</h1>
            <nav className="my-4">
                <ul className="flex gap-2">
                    <li className="border-[.1px] border-gray-700 bg-gray-50/5 rounded-md  shadow-sm">
                        <Link to="/" className="py-4 px-8 block">📗 Listado de canciones</Link>
                    </li>
                    <li className="border-[.1px] border-gray-700 bg-gray-50/5 rounded-md shadow-sm">
                        <Link to="/New" className="py-4 px-8 block">📄 Agregar canción</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}