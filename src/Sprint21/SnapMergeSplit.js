import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import {
  SnapPolygonMode,
  SnapPointMode,
  SnapLineMode,
  SnapModeDrawStyles,
} from "mapbox-gl-draw-snap-mode";
import "./style.css";

const SnapMergeSplit = () => {
  const { map } = useContext(MapContextMapbox);
  const [draw] = useState(
    new MapboxDraw({
      modes: Object.assign(
        {
          snap_point: SnapPointMode,
          snap_line: SnapLineMode,
          snap_polygon: SnapPolygonMode,
        },
        MapboxDraw.modes
      ),
      // styles: DrawStyles,
      styles: SnapModeDrawStyles,
      userProperties: true,
      snap: true,
      // snapOptions: {
      //   snapPx: 15,
      //   snapToMidPoints: true,
      // },
      guides: false,
    })
  );

  let mapRef = useRef(null);

  class extendDrawBar {
    constructor(opt) {
      let ctrl = this;
      ctrl.draw = opt.draw;
      ctrl.buttons = opt.buttons || [];
      ctrl.onAddOrig = opt.draw.onAdd;
      ctrl.onRemoveOrig = opt.draw.onRemove;
    }
    onAdd(map) {
      let ctrl = this;
      ctrl.map = map;
      ctrl.elContainer = ctrl.onAddOrig(map);
      ctrl.buttons.forEach((b) => {
        ctrl.addButton(b);
      });
      return ctrl.elContainer;
    }
    onRemove(map) {
      let ctrl = this;
      ctrl.buttons.forEach((b) => {
        ctrl.removeButton(b);
      });
      ctrl.onRemoveOrig(map);
    }
    addButton(opt) {
      let ctrl = this;
      var elButton = document.createElement("button");
      elButton.className = "mapbox-gl-draw_ctrl-draw-btn";
      if (opt.classes instanceof Array) {
        opt.classes.forEach((c) => {
          elButton.classList.add(c);
        });
      }
      elButton.addEventListener(opt.on, opt.action);
      ctrl.elContainer.appendChild(elButton);
      opt.elButton = elButton;
    }
    removeButton(opt) {
      opt.elButton.removeEventListener(opt.on, opt.action);
      opt.elButton.remove();
    }
  }

  class extendDrawBar2 {
    constructor(opt) {
      let ctrl = this;
      ctrl.checkboxes = opt.checkboxes || [];
      ctrl.onRemoveOrig = opt.draw.onRemove;
    }
    onAdd(map) {
      let ctrl = this;
      ctrl.map = map;
      ctrl._container = document.createElement("div");
      ctrl._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
      ctrl.elContainer = ctrl._container;
      ctrl.checkboxes.forEach((b) => {
        ctrl.addCheckbox(b);
      });
      return ctrl._container;
    }
    onRemove(map) {
      let ctrl = this;
      ctrl.checkboxes.forEach((b) => {
        ctrl.removeButton(b);
      });
      ctrl.onRemoveOrig(map);
    }
    addCheckbox(opt) {
      let ctrl = this;
      var elCheckbox = document.createElement("input");
      elCheckbox.setAttribute("type", "checkbox");
      elCheckbox.checked = opt.initialState === "checked";
      elCheckbox.className = "mapbox-gl-draw_ctrl-draw-btn";
      if (opt.classes instanceof Array) {
        opt.classes.forEach((c) => {
          elCheckbox.classList.add(c);
        });
      }
      elCheckbox.addEventListener(opt.on, opt.action);
      ctrl.elContainer.appendChild(elCheckbox);
      opt.elCheckbox = elCheckbox;
    }
    removeButton(opt) {
      opt.elCheckbox.removeEventListener(opt.on, opt.action);
      opt.elCheckbox.remove();
    }
  }

  useEffect(() => {
    if (!map) return;

    map.addControl(draw, "top-right");

    map.on("load", () => {
      map.resize();
      // map.addControl(draw, "top-right");
      // map.addSource("cut", {
      //   type: "geojson",
      //   data: {
      //     type: "Feature",
      //     properties: {},
      //     geometry: {
      //       type: "Polygon",
      //       coordinates: [
      //         [
      //           [51.41742415918904, 35.73019558439101],
      //           [51.31319413385742, 35.702773908694724],
      //           [51.378997493472525, 35.665562843119986],
      //           [51.45008537540798, 35.67776544979942],
      //           [51.46619566741822, 35.70822028156377],
      //           [51.41742415918904, 35.73019558439101]
      //         ],
      //         [
      //           [51.3912510159731, 35.71074723666955],
      //           [51.37309541966354, 35.707043205182174],
      //           [51.42013718612387, 35.69351115851519],
      //           [51.42256052020156, 35.71823451788042],
      //           [51.3912510159731, 35.71074723666955]
      //         ]
      //       ]
      //     }
      //   }
      // });
      // map.addLayer({
      //   id: "cutttt",
      //   source: "cut",
      //   type: "fill",
      //   paint: {
      //     "fill-outline-color": "#2E0767",
      //     "fill-color": "#E71566",
      //     "fill-opacity": 0.1
      //   }
      // });
      draw.set({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            id: "example-id",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [51.41742415918904, 35.73019558439101],
                  [51.31319413385742, 35.702773908694724],
                  [51.378997493472525, 35.665562843119986],
                  [51.45008537540798, 35.67776544979942],
                  [51.46619566741822, 35.70822028156377],
                  [51.41742415918904, 35.73019558439101],
                ],
              ],
            },
          },
        ],
      });
    });
  }, [map]);

  const cutPolygun = () => {
    console.log(draw.getSelected());
    let main = draw.getSelected();
    let cut;
    draw.changeMode("draw_polygon");
    map.on("draw.create", (e) => {
      console.log(e.features[0]);
      cut = e.features[0];
      main = main.features[0];
      console.log({ main });
      console.log({ cut });
      let afterCut = turf.mask(cut, main);
      console.log({ afterCut });
      console.log(JSON.stringify(afterCut));
      draw.set({
        type: "FeatureCollection",
        features: [afterCut],
      });
      // draw.setFeatureProperty(
      //   "example-id",
      //   "geometry",
      //   rewind(afterCut.geometry)
      // );
    });
  };
  return (
    <div className="map-wrapper" style={{ zIndex: "1", position: "absolute" }}>
      <button
        onClick={() => {
          draw?.changeMode("snap_polygon", { draw: draw });
        }}
      >
        snap_polygon
      </button>
      <button
        onClick={() => {
          draw?.changeMode("snap_point", { draw: draw });
        }}
      >
        snap_point
      </button>
      <button
        onClick={() => {
          draw?.changeMode("snap_line", { draw: draw });
        }}
      >
        snap_line
      </button>
      <button
        onClick={() => {
          cutPolygun();
        }}
      >
        cut
      </button>
      <div id="map" ref={mapRef} />
    </div>
  );
};

export default SnapMergeSplit;
