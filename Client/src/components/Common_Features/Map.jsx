import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, GeoJSON, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as turf from '@turf/turf';
// Optional: Fix for missing marker icons
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import HeatMapLayer from '../Helper/HeatMapLayer';
import L from 'leaflet';
import { CountryCenter } from '../Helper/CountryCenter';
import { FaWater, FaGlobeAsia, FaFire, FaLeaf } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';
import SearchBar from '../Helper/SearchBar';
import MapEffect from '../Helper/MapEffect';
import { getForecast } from '../../ConnectContract/Web3Connection';
import MobileDragControl from '../Helper/MobileDragControl';


const Map = ({ onGet }) => {
  const [center, setCenter] = useState([0, 0]);
  const [disasterData, setDisasterData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(8);
  const [selectedLocation, setSelectedLocation] = useState(null);
  let radiusKm = 10;



  /* Fetch CountryCenter latitude and longitude */
  useEffect(() => {
    const fetchCountryCenter = async () => {
      try {
        const { lat, lng } = await CountryCenter();

        setCenter([lat, lng]);
      } catch (error) {
        console.log(error)
      }
    }
    fetchCountryCenter();
  }, [])

  /* Disaster data shown on map */

  useEffect(() => {
    const fetchData = async () => {

      const liveData = await getForecast();

      const FIVE_DAYS_IN_SECONDS = 86400 * 5;
      const currentTime = Date.now() / 1000;
      const formattedData = liveData.map(item => ({
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        type: item.disasterType,
        riskLevel: item.riskLevel,
        timestamp: Number(item.timestamp)
      })).filter(item => item.timestamp >= currentTime - FIVE_DAYS_IN_SECONDS);

      setDisasterData(formattedData);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 sec

    return () => clearInterval(interval);
  }, []);

  /* See zoomlevel of map */
  const ZoomWatcher = () => {
    useMapEvents({
      zoomend: (e) => {
        setZoomLevel(e.target.getZoom());
      }
    });
    return null;
  };

  /* Dynamic radius based on zoom */

  const getRadius = () => {
    if (zoomLevel >= 13) return 25;
    if (zoomLevel >= 11) return 20;
    if (zoomLevel >= 9) return 15;
    if (zoomLevel >= 7) return 10;
    return 5; // very small on low zoom
  };

  /* Showing gradient */

  const getGradientByRisk = (risk) => {
    if (risk == 2) {
      return { 1.0: 'red' };
    } else if (risk == 1) {
      return { 1.0: 'yellow' };
    } else {
      return { 1.0: 'green' };
    }
  };

  const groupedByGradient = {};

  disasterData.forEach(point => {
    const gradient = getGradientByRisk(point.riskLevel);
    const key = JSON.stringify(gradient); // safely use as map key

    if (!groupedByGradient[key]) {
      groupedByGradient[key] = {
        gradient,
        points: []
      };
    }

    groupedByGradient[key].points.push([point.lat, point.lng, point.riskLevel]);
  });



  const getDisasterIcon = (type) => {
    let IconComponent;
    let color;

    switch (type) {
      case 'flood':
        IconComponent = FaWater;
        color = 'text-sky-400';
        break;
      case 'earthquake':
        IconComponent = FaGlobeAsia;
        color = 'text-sky-700';
        break;
      case 'wildfire':
        IconComponent = FaFire;
        color = 'text-amber-500';
        break;

      case 'drought':
        IconComponent = FaLeaf;
        color = 'text-amber-600';
        break;
      default:
        IconComponent = FaGlobeAsia;
        color = 'text-gray-500';
    }

    const iconHTML = ReactDOMServer.renderToString(
      <IconComponent className={`${color} text-xl`} />
    );

    return new L.DivIcon({
      html: iconHTML,
      className: 'custom-icon',
      iconSize: getRadius(),
    });
  };


  useEffect(() => {
    const showOn = () => {
      if (onGet) {
        const { lat, lng } = onGet;
        setCenter([lat, lng]);
        setSelectedLocation({ lat, lng })
      }
    }
    showOn();
  }, []);


  return (
    <>
      <div className='flex items-center justify-center w-full p-2'>
        <SearchBar
          onSelect={({ lat, lng, name }) => {
            setCenter([lat, lng])
            setSelectedLocation({ lat, lng })
          }}
        />
      </div>

      <div className=" max-md:h-[350px] md:h-[500px] lg:h-[520px] xl:h-[660px] w-full rounded-xl shadow border-6">
        <MapContainer key={`${center[0]}-${center[1]}`} center={center} zoom={5} scrollWheelZoom={true}
          className='  h-full  w-full rounded-lg' >
          {selectedLocation && (
            <MapEffect lat={selectedLocation.lat} lng={selectedLocation.lng} />
          )}
          <MobileDragControl/>
          <ZoomWatcher />
          <TileLayer
            url={import.meta.env.VITE_Map}
          />

          {/* Affected Area */}
          {disasterData.map((flood, index) => {
            const circle = turf.circle([flood.lng, flood.lat], radiusKm, {
              steps: 24,
              units: 'kilometers',
            });

            return (
              <GeoJSON
                key={index}
                data={circle}
                style={{
                  color: 'blue',
                  fillColor: 'blue',
                  fillOpacity: 0.2,
                  weight: 1,
                }}
              />
            );
          })}

          {/* RiskLevel HeatmapLayer */}

          {Object.entries(groupedByGradient).map(([key, group], index) => (
            <HeatMapLayer
              key={index}
              points={group.points}
              radius={getRadius()}
              max={3}
              gradient={group.gradient}
            />
          ))}


          {/* DisasterType Marker */}
          {disasterData.map((disaster, index) => (
            <Marker
              key={index}
              position={[disaster.lat, disaster.lng]}
              icon={getDisasterIcon(disaster.type)}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <span>{disaster.type.toUpperCase()} | Risk Level: {disaster.riskLevel}</span>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </>

  )
}

export default Map