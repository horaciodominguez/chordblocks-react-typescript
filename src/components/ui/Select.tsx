

type Props = {
    name: string,
    label: string,
    value: number,
    onChange: React.ChangeEventHandler<HTMLSelectElement>,
    options: Array<string | number>
}

export const Select = ({name, label, value, onChange, options}: Props) => {
    return (
        <>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="beatsPerMeasure">{label}:</label>
            <select 
                name={name}
                id={name}
                
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                {
                    options.map(option=>(
                        <option key={option} value={option}>{option}</option>
                    ))
                }
                
            </select>
        </>
    )
}