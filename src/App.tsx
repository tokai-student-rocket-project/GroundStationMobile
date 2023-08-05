import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import { GSI } from "./GSI";

import rocket from "./rocket.png";

import "bulma/css/bulma.css";
import { Box, Columns, Heading, Level, Image } from "react-bulma-components";

const flightTimeToText = (flightTime?: number): string => {
  if (flightTime == undefined) return "--.-";

  // uint16_t の -1
  if (flightTime == 65535) return "--.-";

  return (flightTime / 1000.0).toFixed(1);
};

const getFlightMode = (flightModeNumber?: number): string | undefined => {
  if (flightModeNumber == undefined) return undefined;
  if (flightModeNumber < 0 || flightModeNumber > 9) return undefined;

  return [
    "SLEEP",
    "STANDBY",
    "THRUST",
    "CLIMB",
    "DESCENT",
    "DECEL",
    "PARACHUTE",
    "LAND",
    "SHUTDOWN",
  ][flightModeNumber];
};

const getNorm = (x?: number, y?: number, z?: number): number | undefined => {
  if (x == undefined || y == undefined || z == undefined) return undefined;
  return Math.sqrt(x * x + y * y + z * z);
};

const degToDms = (deg?: number): string | undefined => {
  if (deg == undefined) return undefined;

  const d = Math.trunc(deg);
  const ms = parseFloat("0." + deg.toString().split(".")[1]) * 60;
  const m = Math.trunc(ms);
  const s = parseFloat("0." + ms.toString().split(".")[1]) * 60;

  return `${d.toFixed()}°${m.toFixed()}'${s.toFixed(2)}"`;
};

export const App = () => {
  const [flightTime, setFlightTime] = useState<number | undefined>();
  const [flightMode, setFlightMode] = useState<number | undefined>();
  const [altitude, setAltitude] = useState<number | undefined>();
  const [acceleration, setAcceleration] = useState<number | undefined>();
  const [pitch, setPitch] = useState<number | undefined>();
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  useEffect(() => {
    const socket = io(`http://${window.location.hostname}:3010`, {
      transports: ["websocket"],
    });

    socket.on("air-data", (json) => {
      setAltitude(json.Alt);
      setAcceleration(getNorm(json.Lia.x, json.Lia.y, json.Lia.z));
      setPitch(json.Ori.y);
    });
    socket.on("position-data", (json) => {
      setLatitude(json.Latitude);
      setLongitude(json.Longitude);
    });
    socket.on("system-data", (json) => {
      setFlightTime(json.FlightTime);
      setFlightMode(json.FlightMode);
    });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <GSI latitude={latitude} longitude={longitude} />
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: "999",
        }}
      >
        <Box>
          <Box style={{ margin: "-20px -20px 24px -20px" }}>
            <Columns breakpoint="mobile" multiline centered vCentered>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading>
                        {`X+ ${flightTimeToText(flightTime)} sec`}
                      </Heading>
                    </div>
                  </Level.Item>
                </Level>
              </Columns.Column>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading size={6}>フライトモード</Heading>
                      <Heading size={4}>
                        {getFlightMode(flightMode) ?? "-------"}
                      </Heading>
                    </div>
                  </Level.Item>
                </Level>
              </Columns.Column>
            </Columns>
          </Box>
          <Columns breakpoint="mobile" multiline centered>
            <Columns.Column size={6}>
              <Level>
                <Level.Item>
                  <div>
                    <Heading size={6} textAlign="center">
                      高度
                    </Heading>
                    <Heading size={4}>
                      {`${altitude?.toFixed(2) ?? "---.--"} m`}
                    </Heading>
                  </div>
                </Level.Item>
                <Level.Item>
                  <div>
                    <Heading size={6} textAlign="center">
                      加速度
                    </Heading>
                    <Heading size={4}>
                      {`${acceleration?.toFixed(2) ?? "---.--"} m/s`}
                      <span
                        style={{
                          verticalAlign: "super",
                          fontSize: "0.5em",
                        }}
                      >
                        2
                      </span>
                    </Heading>
                  </div>
                </Level.Item>
              </Level>
            </Columns.Column>
            <Columns.Column size={6}>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={rocket}
                  style={{
                    transform: `rotate(${-pitch + 90}deg)`,
                    width: "120px",
                  }}
                ></img>
              </div>
            </Columns.Column>
          </Columns>
        </Box>
        <div style={{ position: "fixed", bottom: "0px", width: "100%" }}>
          <Box>
            <Columns breakpoint="mobile" multiline centered>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading size={5}>{`${
                        degToDms(latitude) ?? "--°--'--.--\""
                      } N`}</Heading>
                    </div>
                  </Level.Item>
                </Level>
              </Columns.Column>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading size={5}>{`${
                        degToDms(longitude) ?? "---°--'--.--\""
                      } E`}</Heading>
                    </div>
                  </Level.Item>
                </Level>
              </Columns.Column>
            </Columns>
          </Box>
        </div>
      </div>
    </div>
  );
};
