import io from "socket.io-client";
import "./App.css";
import { useEffect, useState } from "react";
// import { MapContainer } from "react-leaflet/MapContainer";
// import { TileLayer } from "react-leaflet/TileLayer";
// import { useMap } from "react-leaflet/hooks";
// import { MapContainer, TileLayer, useMap } from "react-leaflet";
import Map, { NavigationControl, Marker } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import mapMarker from './img/unlock-icon.png'
const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"],
});

function App() {

  const [data, setData] = useState([]);

  // 1. listen for a cpu event and update the state
  useEffect(() => {
    socket.on("unlock", (unlocksData) => {
      setData((currentData) => [...currentData, unlocksData]);
    });
  }, []);
  useEffect(() => {
    console.log("statedata", data);
  });
  let i = 0;
  return (
    <div className="App">
      <h1>Unlocks Data</h1>
      <Map mapLib={maplibregl}
        initialViewState={{
          longitude: 18.068581,
          latitude: 59.329323,
          zoom: 10
        }}
        style={{ width: "80%", height: " calc(80vh)" }}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=WlZsDGgEyr9sKXvvdqUW"
      >
        <Marker longitude={18.068581} latitude={59.329323} anchor="bottom" >
          <img width="40px" src={mapMarker} />
        </Marker>
        <Marker longitude={18.05258950286} latitude={59.337208743153006} anchor="bottom" >
          <img width="40px" src={mapMarker} />
        </Marker>
        ,
        {data.map((item) => {
          console.log(item.location[1])
          return (
            <Marker key={i++} longitude={item.location[0].toFixed(6)} latitude={item.location[1].toFixed(6)} anchor="top" >
              <img width="100px" src={mapMarker} />
            </Marker>
          );
        })}



        <NavigationControl position="top-left" />
      </Map>
      {data.map((item) => {
        return (
          <div key={i++}>
            {item.id},{item.location[0]},{item.location[1]}
          </div>
        );
      })}
    </div>
  );
}

export default App;
