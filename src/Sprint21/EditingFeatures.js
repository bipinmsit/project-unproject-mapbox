import React, { useContext, useEffect, useState } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const EditingFeatures = () => {
  const { map } = useContext(MapContextMapbox);
  const [allLayers, setAllLayers] = useState([]);
  const [redoArr, setRedoArr] = useState([]);
  const [draw, setDraw] = useState(new MapboxDraw());

  const undoHandler = (index) => {
    console.log("undoArr: ", allLayers);
    let feat = allLayers[index];
    let prevFeat = allLayers[index - 1];

    let popped = allLayers.pop();
    setRedoArr((pre) => [...pre, popped]);
    draw.delete(feat.id);
  };

  const redoHandler = (feat) => {
    console.log("redoArr: ", redoArr);
    draw.add(feat);
    let poppedElement = redoArr.pop();
    setAllLayers((pre) => [...pre, poppedElement]);
  };

  useEffect(() => {
    if (!map) return;

    map.addControl(draw);
    map.on("load", () => {
      map.on("draw.update", (e) => {
        let id = draw.add(e.features[0].geometry);
        let feature = draw.get(id[0]);
        feature.properties.isEdited = true;

        setAllLayers((pre) => [...pre, feature]);
        draw.delete(id[0]);
      });

      map.on("draw.create", (e) => {
        setAllLayers((pre) => [...pre, e.features[0]]);
      });
    });
  }, [map]);

  return (
    <div style={{ zIndex: "1", position: "relative" }} className="d-flex">
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (allLayers.length === 0) return;
            let lastElementIndex = allLayers.length - 1;
            undoHandler(lastElementIndex);
          }}
        >
          Undo
        </button>
        &nbsp;
        <button
          className="btn btn-primary"
          onClick={() => {
            if (redoArr.length === 0) return;
            redoHandler(redoArr[redoArr.length - 1]);
          }}
        >
          Redo
        </button>
        {/* &nbsp;
        <select name="cars" id="cars">
          <option value="select">Select Layers</option>
          {allLayers.map((val, index) => {
            <option value={val} key={index}>
              {val}
            </option>;
          })}
        </select> */}
      </div>
      <div></div>
    </div>
  );
};

export default EditingFeatures;
