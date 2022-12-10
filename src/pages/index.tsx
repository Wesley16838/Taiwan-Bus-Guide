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
import { UseMapContext } from "../context/mapProvider";
import { useDeepEffect } from "../hooks/useDeepEffect";
import { GetAuthorizationHeader } from "../api/helper";

const Home: NextPage = () => {
  const [bus, setBus] = useState({
    one: [],
    two: [],
    submit: false,
  });
  const [loading, addLoading] = useState(false);
  const [error, setError] = useState('')
  const { location } = useCurrentLocation();
  const { userLocation } = UseMapContext();

  useDeepEffect(() => {
    const loadData = async () => {
      try {
        addLoading(true);
        GetAuthorizationHeader()
        .then(async (token: any) => {
          const result = await GEOAPI.get(
            encodeURI(
              // `${userLocation.longitude === '' ? 121.551655 : userLocation.longitude}, ${userLocation.latitude === '' ? 25.041982 : userLocation.latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
              `121.551655, 25.041982.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
            )
          );
          const city = result.data.features.filter((item: any) =>
            item.id.includes("region")
          )[0].text;
          const country = result.data.features.filter((item: any) =>
            item.id.includes("country")
          )[0].text;
          if(country !== 'Taiwan'){
            addLoading(false)
            setBus({...bus, submit: true})
            setError('SERVICE NOT AVAILABLE HERE')
            return;
          }
          Promise.all([
            API.get(
              encodeURI(
                // `/Bus/Station/City/${city}?$spatialFilter=nearby(${userLocation.latitude === '' ? 25.041982 : userLocation.latitude},${userLocation.longitude === '' ? 121.551655 : userLocation.longitude},300)&$format=JSON`
                `/Bus/Station/City/${city}?$spatialFilter=nearby(25.041982, 121.551655 ,300)&$format=JSON`
              ),
              {
                headers: {
                    "authorization": "Bearer " + token,
                }
              }
            ),
            API.get(
              encodeURI(
                // `/Bus/Station/City/${city}?$spatialFilter=nearby(${userLocation.latitude === '' ? 25.041982 : userLocation.latitude},${userLocation.longitude === '' ? 121.551655 : userLocation.longitude},500)&$format=JSON`
                `/Bus/Station/City/${city}?$spatialFilter=nearby(25.041982, 121.551655, 500)&$format=JSON`
              ),
              {
                headers: {
                    "authorization": "Bearer " + token,
                }
              }
            ),
          ]).then((data: any) => {
            setBus({
              one: data[0].data,
              two: data[1].data,
              submit: true,
            });
            addLoading(false);
          });
        })
        
      } catch (e) {
        addLoading(false);
      }
    };
    if(userLocation.latitude !== '') loadData();
  }, [userLocation.latitude, userLocation.longitude]);

  return (
    <Layout
      pageTitle={`全台公車運用查詢資訊服務`}
      description={"全台公車道報你知，公車車況和車站通通有！"}
      previewImage={"/images/preview_image.png"}
    >
      <div className={styles.wrapper}>
        <div className={styles["section--top"]}>
          <h1>BUS STOP | 附近站牌</h1>
        </div>
        <div className={styles["section--bottom"]}>
          <h2>附近的站牌</h2>
          <Tabs>
            <div id="300m">
              {loading || !bus.submit ? (
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
                            <p key={stop.RouteName["Zh_tw"]+index}>
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
                <div className={styles.result}>
                  {
                    error=== '' ? '查無結果' : error
                  }
                </div>
              )}
            </div>
            <div id="500m">
              {loading || !bus.submit ? (
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
                            <p key={stop.RouteName["Zh_tw"]+index}>
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
                <div className={styles.result}>
                  {
                    error=== '' ? '查無結果' : error
                  }
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
