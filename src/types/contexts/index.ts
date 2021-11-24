export type BusContextState = {
    bus: any[],
    loading: boolean,
    addBus: any;
    addLoading: any;
}

export type MapContextState = {
    userLocation: any,
    map: any,
    addMap: (newMap: any)=>void,
    addUserLocation: any,
}