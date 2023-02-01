import React, { useContext, useEffect, useState } from "react";
import mytif from "./../data/image22.png";
import { MapContextMapbox } from "../Map/Mapbox";
import Image from "./Image";

const Tiff = () => {
  const { map } = useContext(MapContextMapbox);
  const [val, setVal] = useState(100);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (!map) return;

    map.on("load", () => {
      map.addSource("mytiff", {
        type: "image",
        url: mytif,
        coordinates: [
          [-87.5030133074368, 36.86684745654155],
          [-87.49594948604246, 36.86684745654155],
          [-87.49594948604246, 36.861577060097574],
          [-87.5030133074368, 36.861577060097574],
        ],
        // coordinates: [
        //   [-87.4975413, 36.8629185],
        //   [-87.4930459, 36.8629185],
        //   [-87.4930459, 36.8595479],
        //   [-87.4975413, 36.8595479],
        // ],
      });
      map.addLayer({
        id: "mytiff",
        type: "raster",
        source: "mytiff",
        layout: { visibility: "visible" },
      });
    });
  }, [map]);
  return (
    <div>
      <div style={{ zIndex: "1", position: "relative" }}>
        <input
          type="range"
          min={1}
          max={100}
          value={val}
          className="slider"
          onChange={(e) => {
            setVal(parseInt(e.target.value));
            if (map)
              map.setPaintProperty("mytiff", "raster-opacity", val / 100);
          }}
        />
      </div>
    </div>
  );
};

export default Tiff;
