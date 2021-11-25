import React, {
  Component,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";

import { UseMapContext } from "../../context/mapProvider";
import { useDeepEffect } from "../../hooks/useDeepEffect";
import { MapProps } from "../../types/components";

var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map = ({ data, center, userLocation }: MapProps) => {
  const { addMap } = UseMapContext();
  useDeepEffect(() => {
    const loadMap = () => {
      const map = new mapboxgl.Map({
        container: "my-map",
        style: "mapbox://styles/mapbox/light-v10",
        center: center,
        zoom: 13,
      });
      if (typeof userLocation.latitude === "number") {
        const el = document.createElement("div");
        el.className = "marker-myself";
        const marker = new mapboxgl.Marker(el)
          .setLngLat([userLocation.longitude, userLocation.latitude])
          .addTo(map);
      }
      data.forEach((item: any) => {
        const name = "";
        const status = "";
        const itemPosition = item.Position;
        const marker = new mapboxgl.Marker()
          .setLngLat([itemPosition.PositionLon, itemPosition.PositionLat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `
                        <div
                            style="width: 100%; height: 100%; display: flex; justify-content: center; flex-direction: column; padding: 5px 10px;"
                        >
                            <h3 style="margin: 0px 0px 6px 0px">${name}</h3>
                        </div>
                        `
            )
          )
          .addTo(map);
        const markerDiv = marker.getElement();
        markerDiv.addEventListener("onclick", () => marker.togglePopup());
      });
      addMap(map);
    };
    loadMap();
  }, []);

  return <div id="my-map" />;
};

export default Map;
