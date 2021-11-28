import { useEffect, useState } from 'react'
import { InputProps } from '../../types/components'
import styles from '../../styles/components/Inputbox.module.scss'

const Inputboxs = ({type, name, required, onChange, placeholder, classname, defaultValue, onPress}: InputProps) => {
    const [value, setValue] = useState(defaultValue)
    useEffect(()=>{
        setValue(defaultValue)
    }, [defaultValue])
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(e.currentTarget.value)
        // if(onChange) onChange(e.currentTarget.value)
    }
    const handleOnPress = (e: any): void => {
        if (e.key === "Enter" && onPress) {
            onPress(value)
        }
    }
    return(
        <div className={`${styles.container} ${classname && styles[classname]}`}>
            <label>
                <input 
                    value={value} 
                    type={type} 
                    id={name} 
                    name={name} 
                    required={required} 
                    onChange={(e) => handleOnChange(e)} 
                    placeholder={placeholder}
                    onKeyPress={(e) => handleOnPress(e)}
                />
            </label> 
        </div>
        
    )
}

export default Inputboxs;