import React, { useEffect, useRef, useState, useContext } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import mytif from "../data/image22.png";

const Image = ({ data }) => {
  const { map } = useContext(MapContextMapbox);
  const { mapRect } = useContext(MapContextMapbox);
  const imgId = useRef(null);

  if (mapRect.x !== undefined && map) {
    let imgRect = imgId.current?.getBoundingClientRect();
    console.log(mapRect);
    console.log(imgRect);

    // Pixel coordinates of the IMG relative to the MAP
    let pixelXMin = imgRect.left - mapRect.left;
    let pixelXMax = imgRect.right - mapRect.left;
    let pixelYMin = imgRect.top - mapRect.top;
    let pixelYMax = imgRect.bottom - mapRect.top;

    // Use MapboxJS to find Lng,Lat based on IMG pixel coordinates
    // Note that YMin in Pixel space is towards the top of the Viewport
    // And YMax is towards the bottom
    let nw = map.unproject([pixelXMin, pixelYMin]);
    let ne = map.unproject([pixelXMax, pixelYMin]);
    let se = map.unproject([pixelXMax, pixelYMax]);
    let sw = map.unproject([pixelXMin, pixelYMax]);

    // Values to send to Python
    let xMin = nw.lng;
    let xMax = se.lng;
    let yMin = se.lat;
    let yMax = ne.lat;

    console.log([nw, ne, se, sw]);

    map.on("load", () => {
      if (typeof map.getLayer("mytiff") !== "undefined") {
        map.removeLayer("mytiff");
        map.removeSource("mytiff");
      }

      map.addSource("mytiff", {
        type: "image",
        url: mytif,
        coordinates: [
          [nw.lng, nw.lat],
          [ne.lng, ne.lat],
          [se.lng, se.lat],
          [sw.lng, sw.lat],
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
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "50px",
          left: "35px",
          border: "1px solid white",
          zIndex: "1",
        }}
      >
        <img ref={imgId} src={mytif} style={{ height: "400px" }} alt={"alt"} />
      </div>
    </>
  );
};

export default Image;
