import io from "socket.io-client";
import "./App.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { COUNTRIES_DATA } from "./data/countries_data";
import HEX_DATA from "./data/countries_hex_data.json";
import Globe from 'react-globe.gl';

// import mapMarker from './img/unlock-icon.png'
const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"],
});
const getRandomCountry = () => {
  return COUNTRIES_DATA[Math.floor(Math.random() * COUNTRIES_DATA.length)];
};
function App() {

  const [data, setData] = useState([]);

  // 1. listen for a cpu event and update the state
  useEffect(() => {
    socket.on("unlock", (unlocksData) => {
      setData((currentData) => [...currentData, unlocksData]);
    });
  }, []);
  const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;
  const N = 10;
  const gData = [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: 7 + Math.random() * 30,
    color: ['red', 'white', 'blue', 'green', 'orange'][Math.round(Math.random() * 4)]
  }));
  console.log('gdata', gData)

  const globeEl = useRef();
  let country_i = 0;
  const country = COUNTRIES_DATA[country_i];
  const [selectedCountry, setSelectedCountry] = useState({
    lat: country.latitude,
    lng: country.longitude,
    label: country.name
  });
  const [hex, setHex] = useState({ features: [] });

  useEffect(() => {
    setHex(HEX_DATA);
  }, []);

  useEffect(() => {
    let interval;

    interval = setInterval(() => {
      (async () => {
        const country = COUNTRIES_DATA[country_i++];
        setSelectedCountry(
          {
            lat: country.latitude,
            lng: country.longitude,
            label: country.name
          });
      })();
    }, 3000); //Every 3 seconds
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  useEffect(() => {
    const MAP_CENTER = { lat: 0, lng: 0, altitude: 1.5 };
    globeEl.current.pointOfView(MAP_CENTER, 0);
  }, [globeEl]);

  useEffect(() => {
    const countryLocation = {
      lat: selectedCountry.lat,
      lng: selectedCountry.lng,
      altitude: 1.5
    };

    globeEl.current.pointOfView(countryLocation, 0);
  }, [selectedCountry]);


  let i = 0;
  return (
    <div className="App">
      <h1>Unlocks Data</h1>
      {/* <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        htmlElementsData={gData}
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = markerSvg;
          el.style.color = d.color;
          el.style.width = `${d.size}px`;

          el.style['pointer-events'] = 'auto';
          el.style.cursor = 'pointer';
          el.onclick = () => console.info(d);
          return el;
        }}
      /> */}
      <Globe
        htmlElementsData={gData}
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = markerSvg;
          el.style.color = d.color;
          el.style.width = `${d.size}px`;

          el.style['pointer-events'] = 'auto';
          el.style.cursor = 'pointer';
          el.onclick = () => console.info(d);
          return el;
        }}
        ref={globeEl}
        backgroundColor="rgba(0,0,0,0)"
        labelsData={[selectedCountry]}
        labelText={"label"}
        labelSize={1.6}
        labelColor={useCallback(() => "white", [])}
        labelDotRadius={0.4}
        labelAltitude={0.05}
        hexPolygonsData={hex.features}
        hexPolygonResolution={3} //values higher than 3 makes it buggy
        hexPolygonMargin={0.62}
        hexPolygonColor={useCallback(() => "#1b66b1", [])}
      />
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
