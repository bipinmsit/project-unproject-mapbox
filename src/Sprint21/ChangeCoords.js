import React, { useContext, useEffect, useState } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import * as turf from "@turf/turf";

const ChangeCoords = () => {
  const { map } = useContext(MapContextMapbox);
  const [coords, setCoords] = useState([-87.4908146203468, 36.85979156629527]);
  const [lineLastCoords, setLineLastCoords] = useState([
    [-87.5008146203468, 36.85979156629527],
  ]);
  const [poly, setPoly] = useState({});

  useEffect(() => {
    if (!map) return;

    setPoly(turf.buffer(turf.point(coords), 1));

    console.log(turf.buffer(turf.point(coords), 1));

    map.on("load", () => {
      map.addSource("polygon", {
        type: "geojson",
        data: turf.buffer(turf.point(coords), 1),
      });
      map.addLayer({
        id: "polygon",
        type: "fill",
        source: "polygon",
        paint: { "fill-color": "yellow", "fill-opacity": 0.5 },
      });

      // Point
      map.addSource("point", {
        type: "geojson",
        data: turf.point(coords),
      });
      map.addLayer({
        id: "point",
        type: "circle",
        source: "point",
        paint: { "circle-color": "red", "circle-radius": 10 },
      });

      // Line
      map.addSource("line", {
        type: "geojson",
        data: turf.lineString([
          [-87.4908146203468, 36.85879156629527],
          [-87.4908146203468, 36.86879156629527],
          [-87.5008146203468, 36.85979156629527],
        ]),
      });
      map.addLayer({
        id: "line",
        type: "line",
        source: "line",
        paint: { "line-color": "blue", "line-width": 4 },
      });
    });
  }, [map]);
  return (
    <div className="ml-3" style={{ zIndex: "1", position: "relative" }}>
      <div>
        <label style={{ background: "white" }}>Point: </label>
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
              let pt = turf.point(coords);
              console.log(poly);
              let isCoordsInsideJobs = turf.booleanPointInPolygon(pt, poly);
              if (!isCoordsInsideJobs)
                alert("Entered coordinates are outside polygon");
              map.getSource("point").setData(turf.point(coords));
            }
          }}
        >
          Update
        </button>
      </div>

      <div>
        <label style={{ background: "white" }}>Line: </label>
        <input
          type="text"
          value={lineLastCoords}
          size={35}
          onChange={(e) => {
            let lastCoords = [
              e.target.value.split(",")[0],
              e.target.value.split(",")[1],
            ];
            setLineLastCoords(lastCoords);
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            if (map) {
              let lineCoords =
                map.getSource("line")._data?.geometry.coordinates;

              lineCoords.pop();
              lineCoords.push(lineLastCoords);
              console.log(lineCoords);

              map.getSource("line").setData(turf.lineString(lineCoords));
            }
          }}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ChangeCoords;
