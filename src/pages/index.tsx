import { NextPage } from "next";
import Layout from "../components/layout";
import Inputbox from "../components/inputbox";
import Tabs from "../components/tabs";
import styles from "../styles/page/Page.module.scss";
import useCurrentLocation from "../hooks/useCurrentLocation";
import { UseBusContext } from "../context/busProvider";
import GEOAPI from "../api/geocode";
import API from "../api/transport";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [bus, setBus] = useState({
    one: [],
    two: [],
  });
  const [loading, addLoading] = useState(false);
  const { location, error } = useCurrentLocation();

  useEffect(() => {
    const loadData = async () => {
      try {
        addLoading(true);
        const result = await GEOAPI.get(
          encodeURI(
            `121.551655, 25.041982.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
          )
        );
        console.log(result);
        const city = result.data.features.filter((item: any) =>
          item.id.includes("region")
        )[0].text;
        Promise.all([
          API.get(
            encodeURI(
              `/Bus/Station/City/${city}?$spatialFilter=nearby(25.041982,121.551655,100)&$format=JSON`
            )
          ),
          API.get(
            encodeURI(
              `/Bus/Station/City/${city}?$spatialFilter=nearby(25.041982,121.551655,300)&$format=JSON`
            )
          ),
        ]).then((data: any) => {
          setBus({
            one: data[0].data,
            two: data[1].data,
          });
          addLoading(false);
        });
      } catch (e) {
        console.log("err,", e);
        addLoading(false);
      }
    };
    if (location.latitude) loadData();
  }, [location]);

  return (
    <Layout
      pageTitle={`全台公車運用查詢資訊服務`}
      description={"全台公車道報你知，公車車況和車站通通有！"}
      previewImage={"/images/preview_image.png"}
    >
      <div className={styles.wrapper}>
        <div className={styles["section--top"]}>
          <h1>BUS STOP | 附近站牌</h1>
          <Inputbox
            type={"text"}
            name={"search"}
            required={false}
            onChange={() => console.log("search")}
            placeholder={"快速搜尋"}
            defaultValue={""}
          />
        </div>
        <div className={styles["section--bottom"]}>
          <h2>附近的站牌</h2>
          <Tabs>
            <div id="100m">
              {loading ? (
                <div className={styles.loading}>Loading</div>
              ) : bus.one.length !== 0 ? (
                bus.one.map((station: any, index: number) => {
                  return (
                    <div
                      className={`${styles["route-list"]} ${
                        index % 2 !== 0 && styles.darker
                      }`}
                      key={station + index}
                    >
                      <h3>{station.StationName["Zh_tw"]}</h3>
                      <div className={styles["stop-list"]}>
                        {station.Stops.map((stop: any, index: number) => {
                          return (
                            <p>
                              {index !== 0 && "、"}
                              {stop.RouteName["Zh_tw"]}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.result}>查無結果</div>
              )}
            </div>
            <div id="300m">
              {loading ? (
                <div className={styles.loading}>Loading</div>
              ) : bus.two.length !== 0 ? (
                bus.two.map((station: any, index: number) => {
                  return (
                    <div
                      className={`${styles["route-list"]} ${
                        index % 2 !== 0 && styles.darker
                      }`}
                      key={station + index}
                    >
                      <h3>{station.StationName["Zh_tw"]}</h3>
                      <div className={styles["stop-list"]}>
                        {station.Stops.map((stop: any, index: number) => {
                          return (
                            <p>
                              {index !== 0 && "、"}
                              {stop.RouteName["Zh_tw"]}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.result}>查無結果</div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
