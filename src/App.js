import React, { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Mapbox } from "./Map/Mapbox";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import SnapMergeSplit from "./Sprint21/SnapMergeSplit";
import Toggle from "./Sprint20/Toggle";
import Image from "./Sprint20/Image";
import Tiff from "./Sprint20/Tiff";
import ChangeCoords from "./Sprint21/ChangeCoords";
import EditingFeatures from "./Sprint21/EditingFeatures";

function App() {
  const [hide, setHide] = useState(false);
  return (
    <>
      <Mapbox zoom={11} center={[51.41742415918904, 35.73019558439101]}>
        <SnapMergeSplit />
        {/* <Toggle /> */}
        {/* <Image /> */}
        {/* <Tiff /> */}
        {/* <ChangeCoords /> */}
        {/* <EditingFeatures /> */}
      </Mapbox>
    </>
  );
}

export default App;
