import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import { GSI } from "./GSI";

import rocket from "./rocket.png";

import "bulma/css/bulma.css";
import { Box, Columns, Heading, Level, Image } from "react-bulma-components";

export const App = () => {
  const [airData, setAirData] = useState<string | undefined>();
  const [positionData, setPositionData] = useState<string | undefined>();
  const [systemData, setSystemData] = useState<string | undefined>();
  const [sensingData, setSensingData] = useState<string | undefined>();
  const [powerData, setPowerData] = useState<string | undefined>();
  const [valveData, setValveData] = useState<string | undefined>();

  useEffect(() => {
    const socket = io(`http://${window.location.hostname}:3010`, {
      transports: ["websocket"],
    });

    socket.on("air-data", (json) => setAirData(JSON.stringify(json)));
    socket.on("position-data", (json) => setPositionData(JSON.stringify(json)));
    socket.on("system-data", (json) => setSystemData(JSON.stringify(json)));
    socket.on("sensing-data", (json) => setSensingData(JSON.stringify(json)));
    socket.on("power-data", (json) => setPowerData(JSON.stringify(json)));
    socket.on("valve-data", (json) => setValveData(JSON.stringify(json)));
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <GSI latitude={undefined} longitude={undefined} />
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
                      <Heading>X+ 10.0 sec</Heading>
                    </div>
                  </Level.Item>
                </Level>
              </Columns.Column>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading size={6}>フライトモード</Heading>
                      <Heading size={4}>STANDBY</Heading>
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
                    <Heading size={4}>100.0 m</Heading>
                  </div>
                </Level.Item>
                <Level.Item>
                  <div>
                    <Heading size={6} textAlign="center">
                      加速度
                    </Heading>
                    <Heading size={4}>
                      100.0 m/s
                      <span
                        style={{
                          verticalAlign: "super",
                          fontSize: "0.75em",
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
                  width={120}
                  src={rocket}
                  style={{ transform: "rotate(105deg)" }}
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
                      <Heading size={5}>00°00"00.00' N</Heading>
                    </div>
                  </Level.Item>
                </Level>
              </Columns.Column>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading size={5}>000°00"00.00' E</Heading>
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
