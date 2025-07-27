import { Link } from "react-router-dom";

export function Header () {
    return (
        <>
            <h1 className="text-gray-200 text-3xl uppercase text-center p-6">SongBlocks</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/New">Agregar canción</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}