import styles from '../../styles/components/Navbar.module.scss'
import logo from '../../../public/images/buslogo.svg'
import Image from 'next/image'
import Link from '../link'
import locationIcon from '../../../public/images/location.svg'
import notificationIcon from '../../../public/images/notification.svg'
import searchIcon from '../../../public/images/search.svg'
const NavBar = () => {
    return(
        <div className={styles.container}>
            <div className={styles.logo}>
                <Image src={logo} layout={'fill'} objectFit={'contain'}/>
            </div>
            <div className={styles.links}>
                <div>
                    <Link 
                        imagePath={locationIcon} 
                        imageAlt={'Bus stop around of current location'}
                        classname={'nav-link'}
                        destination={'/'}
                    />
                </div>
                <div>
                    <Link 
                        imagePath={searchIcon} 
                        imageAlt={'Search bus stops'}
                        classname={'nav-link'}
                        destination={'/search'}
                    />
                </div>
                <div>
                    <Link 
                        imagePath={notificationIcon} 
                        imageAlt={'Notification'}
                        classname={'nav-link'}
                        destination={'/information'}
                    />
                </div>
            </div>
        </div>
    )
}

export default NavBar;