import { useEffect, useState } from "react";
import { UseMapContext } from "../context/mapProvider";
const useCurrentLocation = () => {
    const {userLocation,addUserLocation} = UseMapContext()
    // store error message in state
    const [error, setError] = useState('');
    const [location, setLocation] = useState({
        latitude:'',
        longitude: ''
    });
    useEffect(() => {
      // If the geolocation is not defined in the used browser you can handle it as an error
      if (!navigator.geolocation) {
        setError('Geolocation is not supported.');
        return;
      } else {
        
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      }
    }, []);

    // Success handler for geolocation's `getCurrentPosition` method
    const handleSuccess = (position:any) => {
        const { latitude, longitude } = position.coords;
        if(Math.round(userLocation.latitude*10000) !== Math.round(latitude*10000) || Math.round(userLocation.longitude*10000) !== Math.round((longitude*10000))){
          setLocation({
            latitude,
            longitude
            });
          addUserLocation(latitude,longitude)
        }
    };

    // Error handler for geolocation's `getCurrentPosition` method
    const handleError = (error: any) => {
        setError(error.message);
    };
    return { location, error };
  };

  export default useCurrentLocation;