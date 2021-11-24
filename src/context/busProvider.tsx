import React, { createContext, useState, useContext } from "react";
import { BusContextState } from "../types/contexts";
const contextDefaultValues: BusContextState = {
    bus:[],
    loading: false,
    addBus: () => {},
    addLoading: () => {},
};
  
export const BusContext = createContext<BusContextState>(
    contextDefaultValues
);
  
export function UseBusContext() {
    return useContext(BusContext);
}

const BusProvider = ({ children }: { children: React.ReactNode }) => {
    const [bus, setBus] = useState(contextDefaultValues.bus);
    const [loading, setLoading] = useState(contextDefaultValues.loading)
    const addBus = (newBus: any) => setBus(newBus);
    const addLoading = (newLoading: boolean) => setLoading(newLoading);

    return (
        <BusContext.Provider
            value={{
                bus,
                loading,
                addBus,
                addLoading,
            }}
        >
            {children}
        </BusContext.Provider>
    );
};

export default BusProvider;