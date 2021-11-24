import { LinkProps } from "../../types/components";
import Image from 'next/image'
import styles from '../../styles/components/Link.module.scss'
import Router, { useRouter } from 'next/router'

const Link = ({imagePath, imageAlt, classname, destination}: LinkProps) => {
    const { asPath } = useRouter()

    const handleOnClick = () => {
         Router.push(`${destination}`)
    }
    return(
        <button className={`${styles[classname]} ${asPath.split('/')[1] === destination.split('/')[1] ? styles.actived : ""}`} onClick={() => handleOnClick()}>
            <Image
                src={imagePath}
                alt={imageAlt}
            />
        </button>
    )
} 
export default Link;