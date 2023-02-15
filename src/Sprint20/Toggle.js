import React, { useContext, useEffect, useRef } from "react";
import { AddressAutofill } from "@mapbox/search-js-react";
import * as turf from "@turf/turf";

const Toggle = () => {
  const searchRef = useRef(null);
  let token =
    "pk.eyJ1Ijoic21vaGFuMjAyMiIsImEiOiJjbDI0bm1xb3owMWxoM2tucGowMnc1ejk1In0.1ZaYMVjLOMwSVoX9QfLUZA";

  let feat = {
    type: "FeatureCollection",
    name: "chk",
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-1.285198555956679, -0.135980746089049],
              [-1.085439229843562, 0.386281588447653],
              [-0.618531889290012, -0.140794223826715],
              [-1.054151624548737, -0.386281588447654],
              [-1.054151624548737, -0.386281588447654],
              [-1.285198555956679, -0.135980746089049],
            ],
          ],
        },
      },
    ],
  };

  useEffect(() => {
    let buff = turf.buffer(feat, 0.0003048);
    console.log(buff);
  }, []);

  return (
    <div style={{ zIndex: "1", position: "absolute" }} ref={searchRef}>
      <AddressAutofill accessToken={token}>
        <input type="text" name="address" autoComplete="street-address" />
      </AddressAutofill>
    </div>
  );
};

export default Toggle;
