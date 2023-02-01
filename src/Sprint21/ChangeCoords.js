import React, { useContext, useEffect, useState } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import * as turf from "@turf/turf";

const ChangeCoords = () => {
  const { map } = useContext(MapContextMapbox);
  const [coords, setCoords] = useState([-87.4908146203468, 36.85979156629527]);
  console.log(coords);

  useEffect(() => {
    if (!map) return;

    map.on("load", () => {
      map.on("mousemove", (e) => {
        // console.log(e);
      });

      map.addSource("point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          name: "test3",
          crs: {
            type: "name",
            properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
          },
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: coords,
              },
            },
          ],
        },
      });
      map.addLayer({
        id: "point",
        type: "circle",
        source: "point",
        paint: { "circle-color": "red", "circle-radius": 10 },
      });
    });
  }, [map]);
  return (
    <div className="ml-3" style={{ zIndex: "1", position: "relative" }}>
      <input
        type="text"
        value={coords}
        size={35}
        onChange={(e) =>
          setCoords([
            parseFloat(e.target.value.split(",")[0]),
            parseFloat(e.target.value.split(",")[1]),
          ])
        }
      />
      <button
        className="btn btn-primary"
        onClick={() => {
          if (map) {
            map.getSource("point").setData(turf.point(coords));
          }
        }}
      >
        Update
      </button>
      ;
    </div>
  );
};

export default ChangeCoords;
