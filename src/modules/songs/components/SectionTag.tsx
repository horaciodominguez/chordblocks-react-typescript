type Props = {
    typeName: string
}

export const SectionTag = ({typeName} : Props) => {
    return (
        <>
            <p className="inline-block bg-blue-100 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 mt-1 mb-2">
                {
                    typeName
                }
            </p>
        </>
    )
}