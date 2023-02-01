import React, { useContext, useEffect } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import SplitLineMode from "mapbox-gl-draw-split-line-mode";
import * as mapboxGlDrawPassingMode from "mapbox-gl-draw-passing-mode";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const SnapMergeSplit = () => {
  const { map } = useContext(MapContextMapbox);

  useEffect(() => {
    if (!map) return;

    const draw = new MapboxDraw({
      modes: Object.assign(MapboxDraw.modes, {
        splitLineMode: SplitLineMode,
        passing_draw_point: mapboxGlDrawPassingMode.passing_draw_point,
        passing_draw_line_string:
          mapboxGlDrawPassingMode.passing_draw_line_string,
        passing_draw_polygon: mapboxGlDrawPassingMode.passing_draw_polygon,
      }),
    });
    map.addControl(draw);
  }, [map]);
  return null;
};

export default SnapMergeSplit;
