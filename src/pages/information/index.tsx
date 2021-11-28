import type { NextPage } from 'next'
import Layout from "../../components/layout";
import styles from "../../styles/page/Page.module.scss";
import Inputbox from "../../components/inputbox";
import API from "../../api/transport";
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

const InformationPage: NextPage = () => {
  const [news, setNews] = useState([])
  useEffect(()=>{
    const loadData = async() => {
      try{
        const news = await API.get(encodeURI(`/Bus/News/InterCity?$format=JSON`))
        setNews(news.data)
      }catch(err){
        console.log('err,', err)
      }
    }
    loadData()
  }, [])

  const handleOnSearch = async (word: string) => {
    try{
      const news = await API.get(encodeURI(`/Bus/News/InterCity?$filter=contains(Title,'${word}')&$format=JSON`))
      setNews(news.data)
    }catch(err){
      console.log('err,', err)
    }
  }
  return (
    <Layout
      pageTitle={`全台公車運用查詢資訊服務`}
      description={"全台公車道報你知，公車車況和車站通通有！"}
      previewImage={"/images/preview_image.png"}
    >
    <div className={styles.wrapper}>
        <div className={styles["section--top"]}>
          <h1>LATEST NEWS | 最新消息</h1>
          <Inputbox
            type={"text"}
            name={"search"}
            required={false}
            onPress={(val: any) => handleOnSearch(val)}
            placeholder={"快速搜尋"}
            defaultValue={""}
          />
        </div>
        <div className={styles["section--bottom"]}>
          <h2>最新消息</h2>
          <div className={styles['news-container']}>
            {
              news.length !== 0 ?
              news.map((item: any, index: number) => {
                return(
                  <div className={`${styles['flex-column']} ${index%2 !== 0 ? styles['news-item--first'] : styles['news-item--second']}`} key={item.NewsID}>
                    <div className={styles.date}>
                      {format(new Date(item.PublishTime), 'MM/dd/yyyy')}
                    </div>
                    <div className={styles.detail}>
                      {item.Title}
                    </div>
                  </div>
                )
              })
              : 
              <div>
                無相關資料  
              </div>
            }
          </div>
        </div>
    </div>
    </Layout>
  )
}

export default InformationPage