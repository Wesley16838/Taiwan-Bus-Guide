import { useEffect, useState } from 'react';
import { TabsProps } from '../../types/components'
import Tab from './tab';
import styles from '../../styles/components/Tabs.module.scss'

const Tabs = ({children, onClick}: TabsProps) => {

    const [activeTab, setActiveTab] = useState(children[0].props.id)
    const  onClickTabItem = (tab: any) => {
        setActiveTab(tab);
        if(onClick) onClick()
    }
    useEffect(()=>{
        setActiveTab(children[0].props.id)
    },[children[0].props.id])
    return(
        <div className={`${styles.tabs} ${children[0].props.id.includes('去') && styles['full-height']}`}>
            <ul className={styles['tab-list']}>
                {children.map((child: any, index: number) => {
                    const { id } = child.props;
                    return (
                    <Tab
                        activeTab={activeTab}
                        key={id+index}
                        label={id}
                        onClick={onClickTabItem}
                        index={index}
                    />
                    );
                })}
            </ul>
            <div className={styles['tab-content']}>
                {children.map((child: any) => {
                    if (child.props.id !== activeTab) return undefined;
                    return child.props.children;
                })}
            </div>
        </div>
    )
}

export default Tabs;