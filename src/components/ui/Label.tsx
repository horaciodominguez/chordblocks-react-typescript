type Props = {
    children: React.ReactNode,
    htmlFor: string
}

export default function Label ({ children, htmlFor } : Props) {
    return (
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={htmlFor}>
            {children}
        </label>
    )
}