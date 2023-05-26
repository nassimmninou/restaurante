import React, { useState, useEffect } from "react";
import Axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const containerStyle = {
    width: '400px',
    height: '400px'
  };
  
  const center = {
    lat: 0.0,
    lng: 0.0
  };
  
  const zoom = 80;
  
  const [selectedRestaurantLocation, setSelectedRestaurantLocation] = useState({
    lat: 0.0,
    lng: 0.0
  });
  
  

  useEffect(() => {
    Axios.get("https://data-hazel-six.vercel.app/restaurants").then((res) => {
      setRestaurants(res.data);
    });
  }, []);

  const handleCitySelect = (event) => {
    setSelectedCity(event.target.value);
    setSelectedZone("");
    setSelectedRestaurant("");
  };

  const handleZoneSelect = (event) => {
    setSelectedZone(parseInt(event.target.value));
    setSelectedRestaurant("");
  };


  const handleRestaurantSelect = (event) => {
    setSelectedRestaurant(event.target.value);
    var title = event.target.value;
    restaurants.forEach((restaurant) => {
      if (restaurant.title === title) {
        setSelectedRestaurantLocation({
          lat: restaurant.location.lat,
          lng: restaurant.location.lng
        });
      }
    });
  };
  

  useEffect(() => {
    if (selectedCity && selectedZone) {
      const startIndex = (selectedZone - 1) * 20;
      const endIndex = selectedZone * 20;
      Axios.get(`https://data-hazel-six.vercel.app/restaurants/${selectedCity}`).then(
      (res) => {
        setRestaurants(res.data.slice(startIndex, endIndex));
      }
    );
  }
}, [selectedCity, selectedZone]);

  return (
    <>
      <Header />
      
      <select value={selectedCity} onChange={handleCitySelect}>
        <option value="">Select a city</option>
        <option value="Casablanca">Casablanca</option>
        <option value="Tanger">Tanger</option>
        <option value="El Jadida">El jadida</option>
        {/* add more cities as needed */}
      </select>
      <select value={selectedZone} onChange={handleZoneSelect}>
        <option value="">Select a zone</option>
        <option value="1">Zone 1</option>
        <option value="2">Zone 2</option>
        <option value="3">Zone 3</option>
        <option value="4">Zone 4</option>
      </select>
      <select value={selectedRestaurant} onChange={handleRestaurantSelect}>
        <option value="">Select a restaurant</option>
        {restaurants.map((restaurant) => (
          <option value={restaurant.id} key={restaurant.id}>
            {restaurant.title}
          </option>
        ))}
      </select>
      <LoadScript
      googleMapsApiKey="AIzaSyD0yMlmaWjIpewkPhPyFnOJHySVYeqvW-4"
    >
      <GoogleMap
  mapContainerStyle={containerStyle}
  center={selectedRestaurantLocation}
  zoom={zoom}
>
  <Marker position={selectedRestaurantLocation} />
  {restaurants.map((restaurant) => (
    <Marker
      key={restaurant.id}
      position={{ lat: restaurant.lat, lng: restaurant.lng }}
    />
  ))}
</GoogleMap>


    </LoadScript>
      <Footer />
    </>
  );
}
