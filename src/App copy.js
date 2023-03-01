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
function App() {
  const markerSvg = `<svg viewBox="-4 0 36 36">
  <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
  <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;
  const globeEl = useRef();
  let country_i = 0;
  const country = COUNTRIES_DATA[country_i];
  let gDatatemp = {
    lat: country.latitude,
    lng: country.longitude,
  };


  const [data, setData] = useState([]);
  const [gData, setGData] = useState([gDatatemp]);
  const [selectedCountry, setSelectedCountry] = useState({
    lat: country.latitude,
    lng: country.longitude,
    label: "New Door Unlocked Here"
  });
  const [hex, setHex] = useState({ features: [] });

  // 1. listen for a cpu event and update the state
  useEffect(() => {
    socket.on("unlock", (unlocksData) => {
      setData((currentData) => [...currentData, unlocksData]);
    });
    setHex(HEX_DATA);
    let interval;
    interval = setInterval(() => {
      (async () => {
        const country = COUNTRIES_DATA[country_i++];
        setSelectedCountry(
          {
            lat: country.latitude,
            lng: country.longitude,
            label: "New Door Unlocked Here"
          });
        setGData(prevData => [{
          lat: country.latitude,
          lng: country.longitude,
        }, ...prevData]);

      })();
    }, 3000); //Every 3 seconds

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);
  useEffect(() => {
    console.log('unlocks data', data)

  });
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

  return (
    <div className="App">
      <h1>Unlocks Data Visualization</h1>

      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        htmlElementsData={gData}
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = markerSvg;
          el.style.color = '#4a52ff';
          el.style.width = '24px';

          el.style['pointer-events'] = 'auto';
          el.style.cursor = 'pointer';
          el.onclick = () => console.info(d);
          return el;
        }}
        ref={globeEl}
        backgroundColor="#fafbff"
        labelsData={[selectedCountry]}
        labelText={"label"}
        labelSize={1.6}
        labelColor={useCallback(() => "white", [])}
        labelDotRadius={0.8}
        labelAltitude={0.05}
        hexPolygonsData={hex.features}
        hexPolygonResolution={3} //values higher than 3 makes it buggy
        hexPolygonMargin={0.62}
        hexPolygonColor={useCallback(() => "#1b66b1", [])}
      />
    </div>
  );
}

export default App;
