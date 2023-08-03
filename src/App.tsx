import { useState, useEffect } from "react";
import { io } from "socket.io-client";

export const App = () => {
  const [flightMode, setFlightMode] = useState<string>();

  useEffect(() => {
    const socket = io("http://10.10.94.17:3010", {
      transports: ["websocket"],
    });

    socket.on("flight-mode", (data) => setFlightMode(data as string));
  }, []);

  return (
    <div>
      <p>FlightMode</p>
      <p>{flightMode}</p>
    </div>
  );
};
