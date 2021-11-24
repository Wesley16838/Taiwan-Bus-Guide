import { TabProps } from "../../types/components";
import styles from '../../styles/components/Tabs.module.scss'

const Tab = ({label, onClick, activeTab, index}: TabProps) => {
    let className = 'tab-list-item';

    const handleOnClick = () => {
        onClick(label);
    }
    return(
    <li
        className={`${styles[className]} ${activeTab === label && styles['tab-list-active']} ${index === 0 ? styles.left : styles.right}`}
        onClick={handleOnClick}
    >
        {label}
    </li>
    )
}

export default Tab;