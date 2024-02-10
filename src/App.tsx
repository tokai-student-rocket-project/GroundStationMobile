import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

import { GSI } from "./GSI";

import rocket from "./images/rocket.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

import "bulma/css/bulma.css";
import { Box, Button, Columns, Heading, Level } from "react-bulma-components";

export const App = () => {
  const [flightTime, setFlightTime] = useState<string | undefined>();
  const [flightMode, setFlightMode] = useState<string | undefined>();
  const [altitude, setAltitude] = useState<string | undefined>();
  const [acceleration, setAcceleration] = useState<string | undefined>();
  const [pitch, setPitch] = useState<number | undefined>();
  const [latitudeDms, setLatitudeDms] = useState<string | undefined>();
  const [latitudeDeg, setLatitudeDeg] = useState<number | undefined>();
  const [longitudeDms, setLongitudeDms] = useState<string | undefined>();
  const [longitudeDeg, setLongitudeDeg] = useState<number | undefined>();
  const [positionAccuracy, setPositionAccuracy] = useState<
    number | undefined
  >();

  const search = useLocation().search;

  useEffect(() => {
    const query = new URLSearchParams(search);
    const socket = io(`https://${query.get("ws")}:3010`, {
      transports: ["websocket"],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("data", (data: any) => {
      const json = JSON.parse(data);
      setAltitude(json.Alt);
      setAcceleration(json.Acc);
      setPitch(Number(json.Ori));
      setLatitudeDeg(Number(json.LatDeg));
      setLatitudeDms(json.LatDms);
      setLongitudeDeg(Number(json.LonDeg));
      setLongitudeDms(json.LonDms);
      setPositionAccuracy(json.PosAcc);
      setFlightTime(json.FlightTime);
      setFlightMode(json.FlightMode);
      console.log(json);
    });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <GSI
        latitude={latitudeDeg}
        longitude={longitudeDeg}
        accuracy={positionAccuracy}
      />
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: "999",
        }}
      >
        <Box style={{ borderRadius: "0 0 6px 6px" }}>
          <Box
            style={{
              margin: "-20px -20px 24px -20px",
              borderRadius: "0 0 6px 6px",
            }}
          >
            <Columns breakpoint="mobile" multiline centered vCentered>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading>{`X+ ${flightTime ?? "--.--"} sec`}</Heading>
                    </div>
                  </Level.Item>
                </Level>
              </Columns.Column>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading size={6}>フライトモード</Heading>
                      <Heading size={4}>{flightMode ?? "-------"}</Heading>
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
                    <Heading size={4}>{`${altitude ?? "---.--"} m`}</Heading>
                  </div>
                </Level.Item>
                <Level.Item>
                  <div>
                    <Heading size={6} textAlign="center">
                      加速度
                    </Heading>
                    <Heading size={4}>
                      {`${acceleration ?? "---.--"} m/s`}
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
                    transform: `rotate(${pitch === null ? 0 : pitch!}deg)`,
                    width: "120px",
                  }}
                ></img>
              </div>
            </Columns.Column>
          </Columns>
        </Box>
        <div style={{ position: "fixed", bottom: "0px", width: "100%" }}>
          <Button
            onClick={() =>
              (window.location.href =
                "https://tokai-student-rocket-project.github.io/RocketAR/")
            }
            className="is-link is-light"
          >
            <FontAwesomeIcon
              icon={faRocket}
              bounce
              style={{ margin: "auto" }}
            />
            <p className="mx-1 is-size-5">AR</p>
          </Button>
          <Box style={{ borderRadius: "6px 6px 0 0" }}>
            <Columns breakpoint="mobile" multiline centered>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading size={5}>{`${
                        latitudeDms ?? "--°--′--″N"
                      } `}</Heading>
                    </div>
                  </Level.Item>
                </Level>
              </Columns.Column>
              <Columns.Column size={6}>
                <Level>
                  <Level.Item>
                    <div>
                      <Heading size={5}>{`${
                        longitudeDms ?? "--°--′--″E"
                      }`}</Heading>
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
