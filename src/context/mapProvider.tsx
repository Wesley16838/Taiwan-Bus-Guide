import React, { createContext, useState, useContext } from "react";
import { MapContextState } from "../types/contexts";
const contextDefaultValues: MapContextState = {
    userLocation: {
        latitude:'',
        longitude: ''
    },
    map: null,
    addMap: () => {},
    addUserLocation: () => {},
};
  
export const MapContext = createContext<MapContextState>(
    contextDefaultValues
);
  
export function UseMapContext() {
    return useContext(MapContext);
}

const MapProvider = ({ children }: { children: React.ReactNode }) => {
    const [userLocation, setUserLocation] = useState(contextDefaultValues.userLocation);
    const addUserLocation = (newLatitude: any, newLongitude: any) => {
        setUserLocation({latitude: newLatitude, longitude: newLongitude})
    };

    const [map, setMap] = useState(contextDefaultValues.map);
    const addMap = (newMap: any) => {
        setMap(newMap);
    }

    return (
        <MapContext.Provider
            value={{
                userLocation,
                map,
                addMap,
                addUserLocation,
            }}
        >
            {children}
        </MapContext.Provider>
    );
};

export default MapProvider;