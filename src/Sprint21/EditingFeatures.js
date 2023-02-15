import React, { useContext, useEffect, useState } from "react";
import { MapContextMapbox } from "../Map/Mapbox";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

const EditingFeatures = () => {
  const { map } = useContext(MapContextMapbox);
  const [allLayers, setAllLayers] = useState([]);
  const [redoArr, setRedoArr] = useState([]);
  const [draw] = useState(new MapboxDraw({}));
  const [editedArr, setEditedArr] = useState([]);
  // let editedArr = [];

  const rearrangeFeaturesBasedOnEditing = (id, arr) => {
    let filteredArr = arr.filter((out) => out.childId.id === id)[0];
    let index = allLayers.findIndex(
      (out) => out.id === filteredArr.parentFeat.id
    );
    let newArr = [...allLayers];
    let tempArr = newArr.splice(index, 1);
    newArr.push(tempArr[0]);

    [newArr[newArr.length - 1], newArr[newArr.length - 2]] = [
      newArr[newArr.length - 2],
      newArr[newArr.length - 1],
    ];

    return newArr;
    // return allLayers.push(newArr[0]);
  };

  const undoHandler = (index, arr) => {
    console.log("undoArr: ", allLayers);
    let feat = allLayers[index];
    // let editiedId = feat.id;
    // let prevFeat = rearrangeFeaturesBasedOnEditing(editiedId, arr);
    let prevFeat = allLayers[index - 1];

    if (feat.properties.isEdited) {
      // Adding previous index feature
      draw.add(prevFeat);

      // Undo element moved to redoArr
      let popped = allLayers.pop();
      setRedoArr((pre) => [...pre, popped]);

      // Deleting last index feature
      draw.delete(feat.id);
    } else if (feat.properties.isCreated) {
      let popped = allLayers.pop();
      setRedoArr((pre) => [...pre, popped]);
      draw.delete(feat.id);
    }
  };

  const redoHandler = (index) => {
    console.log("redoArr: ", redoArr);
    let tempArr = [];
    let feat = redoArr[index];
    if (feat.properties.isEdited) {
      draw.delete(allLayers[allLayers.length - 1].id);

      draw.add(feat);
      let poppedElement = redoArr.pop();
      tempArr.pop();
      setAllLayers((pre) => [...pre, poppedElement]);
    } else if (feat.properties.isCreated) {
      let idr = draw.add(feat);
      tempArr.push(idr);
      let poppedElement = redoArr.pop();
      setAllLayers((pre) => [...pre, poppedElement]);
    }
  };

  useEffect(() => {
    if (!map) return;

    map.addControl(draw);
    // map.on("load", () => {
    map.on("draw.update", (e) => {
      let id = draw.add(e.features[0].geometry);
      let feature = draw.get(id[0]);
      feature.properties.isEdited = true;

      // editedArr.push({ parentFeat: e.features[0], childId: feature });

      setEditedArr((pre) => [
        ...pre,
        { parentFeat: e.features[0], childId: feature },
      ]);
      setAllLayers((pre) => [...pre, feature]);
      draw.delete(id[0]);
    });

    map.on("draw.create", (e) => {
      let feature = e.features[0];
      feature.properties.isCreated = true;
      setAllLayers((pre) => [...pre, feature]);
    });
    // });
  }, [map]);

  return (
    <div style={{ zIndex: "1", position: "relative" }} className="d-flex">
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log(editedArr);
            if (allLayers.length === 0) return;
            let lastElementIndex = allLayers.length - 1;
            undoHandler(lastElementIndex, editedArr);
          }}
        >
          Undo
        </button>
        &nbsp;
        <button
          className="btn btn-primary"
          onClick={() => {
            if (redoArr.length === 0) return;
            let lastElementIndex = redoArr.length - 1;
            redoHandler(lastElementIndex);
          }}
        >
          Redo
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default EditingFeatures;
