import styles from '../../styles/components/Button.module.scss';
import Image from 'next/image';
import { ButtonProps } from '../../types/components';

const Buttons = ({onClick, text, disabled}: ButtonProps) => {
    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>): void  => {
        e.preventDefault()
        if(onClick) onClick()
    }
    
    return(
        <button className={styles.wrapper} onClick={(e) => handleOnClick(e)} disabled={disabled}>
            {text}
        </button>
    )
     
}

export default Buttons;