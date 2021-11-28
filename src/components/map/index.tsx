import React, {
  Component,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { UseMapContext } from "../../context/mapProvider";
import { useDeepEffect } from "../../hooks/useDeepEffect";
import { MapProps } from "../../types/components";
import busWhite from "../../../public/images/busWhite.svg";

var mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const Map = ({ data, center, userLocation, busLocation }: MapProps) => {
  const { map, addMap } = UseMapContext();
  useDeepEffect(() => {
    const loadMap = () => {
      let newMap: any = map;
      if (newMap === null) {
        newMap = new mapboxgl.Map({
          container: "my-map",
          style: "mapbox://styles/mapbox/light-v10",
          center: center,
          zoom: 13,
        });
      } else {
        let num = newMap._markers.length
        for(let i = 0 ; i<num; i++){
          newMap._markers[0].remove();
        }
        if(typeof newMap.getLayer('route') !== 'undefined'){
          newMap.removeLayer('route').removeSource('route');
        }
      }
      if (typeof userLocation[0] === "number" && data.length === 0) {
        const el = document.createElement("div");
        el.className = "marker-myself";
        const marker = new mapboxgl.Marker(el)
          .setLngLat([userLocation[0], userLocation[1]])
          .addTo(newMap);
        newMap.flyTo({
          center: userLocation,
        })
      } else {
        const el = document.createElement("div");
        el.className = "marker-myself";
        const marker = new mapboxgl.Marker(el)
          .setLngLat([userLocation[0], userLocation[1]])
          .addTo(newMap);
        newMap.flyTo({
          center: [data[0].name.StopPosition.PositionLon, data[0].name.StopPosition.PositionLat],
        })
      }
      const arr: any[][] = []
      data.forEach((item: any) => { 
        const name = item.name.StopName['Zh_tw'];
        const status = item.status.label.split('_')[0];
        const itemPosition = item.name.StopPosition;
        arr.push([itemPosition.PositionLon, itemPosition.PositionLat])
        const el = document.createElement("div");
        el.className = "stop-marker";
        el.innerHTML = `<p style="margin: 0px; font-weight: bold; color: #ffffff; font-size: 16px;">${item.name.StopSequence}</p>`;
        const marker = new mapboxgl.Marker(el)
          .setLngLat([itemPosition.PositionLon, itemPosition.PositionLat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `
                        <div
                            style="width: 100%; height: 100%; display: flex; justify-content: center; flex-direction: column; padding: 5px 10px;"
                        >
                            <p style="margin: 0px 0px 6px 0px; color: #486ae8; font-size: 14px; font-weight: bold">${name}</p>
                            <p style="margin: 0px 0px 0px 0px; font-size; 12px;">${status}</p>
                        </div>
                        `
            )
          )
          .addTo(newMap);
        const markerDiv = marker.getElement();
        markerDiv.addEventListener("onclick", () => marker.togglePopup());
      });

      busLocation.forEach((bus: any) => {
        const plateNum = bus.PlateNumb
        const location = bus.BusPosition
        const el = document.createElement("div");
        el.innerHTML = `<div style="width: 60px; height:40px; border-radius: 6px; background-color: #486ae8; display: flex; flex-direction: column; align-items: center; justify-content: center;"><img src=${busWhite.src} width="16" height="19"/><p style="margin: 0px; font-weight: 400; color: #ffffff; font-size: 12px;">${plateNum}</p></div>`;
        const marker = new mapboxgl.Marker(el)
          .setLngLat([location.PositionLon, location.PositionLat])
          .addTo(newMap);
      })

      if(arr.length !== 0){
        newMap.addSource('route', {
          'type': 'geojson',
          'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                  'type': 'LineString',
                  'coordinates': arr
              }
            }
        })
  
        newMap.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#3356D6',
            'line-width': 4
          }
        });
      }

      addMap(newMap);
    };
    loadMap();
  }, [data, userLocation]);

  return <div id="my-map"/>;
};

export default Map;
