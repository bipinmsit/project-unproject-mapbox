import React, { createContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

export const MapContextMapbox = new createContext();

export const Mapbox = ({ children, zoom, center }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapRect, setMapRect] = useState({});

  mapboxgl.accessToken =
    "pk.eyJ1Ijoic21vaGFuMjAyMiIsImEiOiJjbDI0bm1xb3owMWxoM2tucGowMnc1ejk1In0.1ZaYMVjLOMwSVoX9QfLUZA";

  useEffect(() => {
    const options = {
      style: "mapbox://styles/mapbox/satellite-streets-v11",
      container: mapRef.current,
      zoom,
      center,
    };

    const mapObj = new mapboxgl.Map(options);
    setMap(mapObj);

    return () => setMap(null);
  }, [zoom, center]);

  //   zoom change handler
  useEffect(() => {
    if (!map) {
      return;
    }
    map.setZoom(zoom);
  }, [map, zoom]);

  //   center change handler
  useEffect(() => {
    if (!map) {
      return;
    }
    map.setCenter(center);
  }, [center, map]);

  useEffect(() => {
    if (!map) return;

    if (mapRef.current != null)
      setMapRect(mapRef.current?.getBoundingClientRect());
  }, [map]);

  return (
    <MapContextMapbox.Provider value={{ map: map, mapRect: mapRect }}>
      <div ref={mapRef} className="mapbox-container">
        {children}
      </div>
    </MapContextMapbox.Provider>
  );
};
