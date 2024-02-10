import { renderToString } from "react-dom/server";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { ChangeCenter } from "./ChangeCenter";

import tsrp from "./images/tsrp.png";

const icon = L.divIcon({
  className: "custom-icon",
  html: renderToString(
    <>
      <div
        style={{
          position: "absolute",
          left: "-25%",
          top: "-120%",
          width: "40px",
          height: "20px",
        }}
      >
        <div
          className="has-background-dark"
          style={{
            width: "17px",
            height: "17px",
            transform: "rotate(45deg)",
          }}
        ></div>
      </div>
      <div
        className="is-flex is-align-items-center has-background-dark"
        style={{
          position: "absolute",
          borderRadius: "6px",
          top: "-300%",
          left: "-315%",
        }}
      >
        <figure className="image is-24x24 mx-1">
          <img src={tsrp} style={{ width: "24px", height: "24px" }} />
        </figure>
        <p className="has-text-light is-size-5" style={{ width: "52px" }}>
          H-59
        </p>
      </div>
    </>
  ),
});

type Props = {
  latitude?: number;
  longitude?: number;
  accuracy?: number;
};

export const GSI = ({ latitude, longitude, accuracy }: Props) => {
  latitude = latitude == 0 ? undefined : latitude;
  longitude = longitude == 0 ? undefined : longitude;
  accuracy = accuracy == 0 ? undefined : accuracy;

  // コムスク
  const center: L.LatLngExpression = [
    latitude ?? 35.36099,
    longitude ?? 139.271668,
  ];

  // 大樹
  // const center: L.LatLngExpression = [
  //   latitude ?? 42.51439,
  //   longitude ?? 143.439794,
  // ];

  return (
    <MapContainer
      zoomControl={false}
      center={center}
      zoom={17}
      style={{ position: "fixed", height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>'
        url="map/tile/{z}/{x}/{y}.png"
      />
      <Marker position={center} autoPan={false} icon={icon} />
      <ChangeCenter center={center} />
      <Circle
        center={center}
        pathOptions={{
          color: "royalblue",
          stroke: false,
          fillOpacity: 0.5,
        }}
        radius={accuracy ?? 0}
      />
      {/* <Circle
        center={[40.138633, 139.98485]}
        pathOptions={{
          color: "magenta",
          stroke: false,
        }}
        radius={75}
      />
      <Circle
        center={[40.138633, 139.98485]}
        pathOptions={{ color: "magenta" }}
        radius={5}
      />
      <Polyline
        pathOptions={{ color: "magenta" }}
        positions={[
          [40.138633, 139.98485],
          [40.138288, 139.984472],
        ]}
      />
      <Polygon
        pathOptions={{ color: "magenta", fill: false }}
        positions={[
          [40.1349508, 139.981351],
          [40.1347478, 139.981871],
          [40.135639, 139.983324],
          [40.138053, 139.985781],
          [40.1400941, 139.986823],
          [40.1411762, 139.988142],
          [40.1420251, 139.985234],
        ]}
      /> */}
    </MapContainer>
  );
};
