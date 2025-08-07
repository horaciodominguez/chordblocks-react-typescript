type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    name: string,
    label: string,
    value: string,
    type?: string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
}

export default function Input ({ name, label, value, type="text", onChange } : Props) {
    return (
        <>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>{label}</label>
            <input 
                id={name} 
                name={name}
                value={value ?? ""} 
                type={type}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={onChange} 
            />
        </>
    )
}