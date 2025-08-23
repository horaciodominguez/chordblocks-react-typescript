
type Props = {
    name: string,
    label: string,
    options: readonly (string | number)[]

    value?: string | number,
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    defaultValue?: string,
    ref?: React.Ref<HTMLSelectElement>
    
}

export const Select = ({name, label, options, value, onChange, defaultValue, ref }: Props) => {
    const isControlled = value !== undefined && onChange !== undefined
    return (
        <>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="beatsPerMeasure">{label}:</label>
            <select 
                name={name}
                id={name}
                onChange={onChange}
                { ...(isControlled) ? {value} : { defaultValue, ref} }
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                {
                    (defaultValue!=undefined && defaultValue==="") ? <option value="" disabled>SELECT...</option> : ""
                }
                {
                    options.map(option=>(
                        <option key={option} value={option}>{option}</option>
                    ))
                }
                
            </select>
        </>
    )
}