import React, { useContext, useEffect, useState } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const EditingFeatures = () => {
  const { map } = useContext(MapContextMapbox);
  const [allLayers, setAllLayers] = useState([]);
  const [counter, setCounter] = useState(0);
  const [draw, setDraw] = useState(new MapboxDraw());

  const undoHandler = (feat) => {
    draw.delete(feat.id);
    draw.add(feat);
    allLayers.pop();
  };

  useEffect(() => {
    if (!map) return;

    map.on("load", () => {
      map.addControl(draw);

      map.on("draw.update", (e) => {
        let id = draw.add(e.features[0].geometry);

        setAllLayers((pre) => [...pre, { id: id[0], feat: draw.get(id[0]) }]);
        draw.delete(id[0]);
      });

      map.on("draw.create", (e) => {
        let mode = draw.getMode();

        setAllLayers((pre) => [
          ...pre,
          { id: e.features[0].id, feat: e.features[0] },
        ]);

        // if (mode == "draw_polygon") {
        //   setAllLayers((pre) => [
        //     ...pre,
        //     { id: e.features[0].id, feat: e.features[0] },
        //   ]);
        // } else if (mode == "draw_line_string") {
        //   setAllLayers((pre) => [
        //     ...pre,
        //     { id: e.features[0].id, feat: e.features[0] },
        //   ]);
        // } else if (mode == "draw_point") {
        //   setAllLayers((pre) => [
        //     ...pre,
        //     { id: e.features[0].id, feat: e.features[0] },
        //   ]);
        // }
      });
    });
  }, [map, draw, counter]);

  return (
    <div style={{ zIndex: "1", position: "relative" }} className="d-flex">
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log(allLayers);
            undoHandler(allLayers[allLayers.length - 1].feat);
          }}
        >
          Undo
        </button>
        &nbsp;
        <button
          className="btn btn-primary"
          // onClick={() => {
          //   console.log(history);
          //   redoHandler(history[history.length - 1].feat);
          // }}
        >
          Redo
        </button>
        &nbsp;
        <select name="cars" id="cars">
          <option value="select">Select Layers</option>
          {allLayers.map((val, index) => {
            <option value={val} key={index}>
              {val}
            </option>;
          })}
        </select>
      </div>
      <div></div>
    </div>
  );
};

export default EditingFeatures;
