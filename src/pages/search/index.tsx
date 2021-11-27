import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import Layout from "../../components/layout";
import Inputbox from "../../components/inputbox";
import styles from "../../styles/page/Page.module.scss";
import Image from "next/image";
import Buttons from "../../components/buttons";
import Dropdowns from "../../components/dropdown";
import { CityData } from "../../constants";
import locateIcon from "../../../public/images/locate.svg";
import API from "../../api/transport";
import Tabs from "../../components/tabs";
import arrowIcon from "../../../public/images/arrowdown.svg";
const MyMap = dynamic(() => import("../../components/map"), { ssr: false });

const SearchPage: NextPage = () => {
  const [search, setSearch] = useState({
    city: "",
    route: "",
  });
  const [routes, setRoutes] = useState<string[]>([]);
  const [result, setResult] = useState<any>({
    departure: [],
    return: [],
  });

  const handleOnChange = (name: string, val: string) => {
    if (name === "city") {
      setSearch({ city: val, route: "" });
      API.get(encodeURI(`/Bus/Route/City/${val}?$format=JSON`)).then(
        (data: any) => {
          setRoutes(data.data.map((item: any) => item.RouteName["Zh_tw"]));
        }
      );
    } else {
      setSearch({ ...search, route: val });
    }
  };

  const handleOnSubmit = () => {
    Promise.all([
      API.get(
        encodeURI(
          `/Bus/DisplayStopOfRoute/City/${search.city}/${search.route}?$format=JSON`
        )
      ),
      API.get(
        encodeURI(
          `/Bus/EstimatedTimeOfArrival/City/${search.city}/${search.route}?$format=JSON`
        )
      ),
      API.get(
        encodeURI(
          `/Bus/RealTimeNearStop/City/${search.city}/${search.route}?$format=JSON`
        )
      ),
    ]).then((data: any) => {
      const date = new Date();
      const minutes = date.getMinutes();
      const hour = date.getHours();
      const departureStops: any = [];
      const returnStops: any = [];
      data[0].data[0].Stops.forEach((stop: any) => {
        const index = data[1].data.findIndex(
          (item: any) =>
            item.StopName["Zh_tw"] === stop.StopName["Zh_tw"] &&
            item.Direction === 0
        );
        const obj = data[1].data[index];
        let busStatus = "";
        switch (obj.StopStatus) {
          case 0:
            const hr = Math.floor(obj.EstimateTime / 3600);
            const min = Math.floor((obj.EstimateTime - 3600 * hr) / 60);
            const carry = Math.floor((minutes + Math.floor(min)) / 60);
            busStatus = `${hour + hr + carry} : ${
              minutes + min - carry * 60 < 10 ? 0 : ""
            }${minutes + min - carry * 60}`;
            break;
          case 1:
            busStatus = "尚未發車";
            break;
          case 2:
            busStatus = "交管不停靠";
            break;
          case 3:
            busStatus = "末班車已過";
            break;
          case 4:
            busStatus = "今日未營運";
            break;
        }
        departureStops.push({ name: stop, status: busStatus });
      });
      data[0].data[1].Stops.forEach((stop: any) => {
        const index = data[1].data.findIndex(
          (item: any) =>
            item.StopName["Zh_tw"] === stop.StopName["Zh_tw"] &&
            item.Direction === 1
        );
        const obj = data[1].data[index];
        let busStatus = "";
        switch (obj.StopStatus) {
          case 0:
            const hr = Math.floor(obj.EstimateTime / 3600);
            const min = Math.floor((obj.EstimateTime - 3600 * hr) / 60);
            const carry = Math.floor((minutes + Math.floor(min)) / 60);
            busStatus = `${hour + hr + carry} : ${
              minutes + min - carry * 60 < 10 ? 0 : ""
            }${minutes + min - carry * 60}`;
            break;
          case 1:
            busStatus = "尚未發車";
            break;
          case 2:
            busStatus = "交管不停靠";
            break;
          case 3:
            busStatus = "末班車已過";
            break;
          case 4:
            busStatus = "今日未營運";
            break;
        }
        returnStops.push({ name: stop, status: busStatus });
      });
      setResult({
        departure: departureStops,
        return: returnStops,
      });
    });
  };
  console.log("result,", result);
  return (
    <Layout
      pageTitle={`全台公車運用查詢資訊服務`}
      description={"全台公車道報你知，公車車況和車站通通有！"}
      previewImage={"/images/preview_image.png"}
    >
      <div className={styles.wrapper}>
        <div className={styles["section--top"]}>
          <h1>ROAD SEARCH | 路線搜尋</h1>
          <Inputbox
            type={"text"}
            name={"search"}
            required={false}
            onChange={() => console.log("search")}
            placeholder={"快速搜尋"}
            defaultValue={""}
          />
        </div>
        <div className={styles["search-wrapper"]}>
          <div className={styles["item-search"]}>
            <h2>Where are you going?</h2>
            <div className={styles["flex-row"]}>
              <Image src={locateIcon} width={18} height={22} />
              <Dropdowns
                data={CityData}
                defaultLabel={CityData.defaultValue.label}
                defaultValue={CityData.defaultValue.value}
                onClick={(val: string) => handleOnChange("city", val)}
              />
            </div>
            <div className={styles["flex-row"]}>
              <Image src={locateIcon} width={18} height={22} />
              <Dropdowns
                arrayData={routes}
                defaultLabel={
                  search.city === "" ? "選擇路線" : CityData.defaultValue.label
                }
                defaultValue={
                  search.city === "" ? "" : CityData.defaultValue.value
                }
                onClick={(val: string) => handleOnChange("route", val)}
              />
            </div>
            <div className={styles["button-container"]}>
              <Buttons
                text={"搜尋"}
                onClick={handleOnSubmit}
                disabled={search.route === ""}
              />
            </div>
          </div>
          <div className={styles["item-result"]}>
            <Tabs>
              <div
                id={`去${
                  result.departure.length === 0
                    ? "--"
                    : result.departure[result.departure.length - 1].name
                        .StopName["Zh_tw"]
                }`}
              >
                <div className={styles["search-route-list"]}>
                  {search.route === "" ? (
                    <div className={styles["search-result"]}>
                      尚未輸入路線資訊！
                    </div>
                  ) : result.departure.length === 0 ? (
                    <div className={styles["search-result"]}>查無資料</div>
                  ) : (
                    result.departure.map((stop: any, index: number) => {
                      return (
                        <div
                          className={`${styles["search-result-item"]} ${
                            index % 2 === 0 && styles.darker
                          }`}
                          key={`departure${index}`}
                        >
                          <Image src={arrowIcon} width={16} height={16} />
                          <p>{stop.name.StopName["Zh_tw"]}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div
                id={`回${
                  result.return.length === 0
                    ? "--"
                    : result.return[result.return.length - 1].name.StopName[
                        "Zh_tw"
                      ]
                }`}
              >
                <div className={styles["search-route-list"]}>
                  {search.route === "" ? (
                    <div className={styles["search-result"]}>
                      尚未輸入路線資訊！
                    </div>
                  ) : result.return.length === 0 ? (
                    <div className={styles["search-result"]}>查無資料</div>
                  ) : (
                    result.return.map((stop: any, index: number) => {
                      return (
                        <div
                          className={`${styles["search-result-item"]} ${
                            index % 2 === 0 && styles.darker
                          }`}
                          key={`return${index}`}
                        >
                          <Image src={arrowIcon} width={16} height={16} />
                          <p>{stop.name.StopName["Zh_tw"]}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </Tabs>
          </div>
          <div className={styles["item-map"]}>
            <MyMap
              data={result.departure}
              center={[
                result.departure[0]?.name?.StopPosition?.PositionLon ||
                  121.551655,
                result.departure[0]?.name?.StopPosition?.PositionLat ||
                  25.041982,
              ]}
              userLocation={[121.551655, 25.041982]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
