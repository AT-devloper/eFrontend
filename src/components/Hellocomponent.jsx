import { useEffect, useState } from "react";
import { getHelloMessage } from "../services/helloservice";

function Hellocomponent() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getHelloMessage()
      .then(res => setMessage(res.data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default Hellocomponent;
