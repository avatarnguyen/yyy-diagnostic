import { useState } from "react";
import Chatbot from "./Chatbot/Chatbot";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import { Button, Image } from "react-bootstrap";
import chatBgImg from "./assets/images/YY&Y_Klecks-bunt.jpeg";
import handBtnImage from "./assets/images/Hand_Yin-Young-&-You.png";

function App() {
  const [start, setStart] = useState(false);

  return (
    <div
      className="App"
      style={{ height: "100vh", backgroundImage: `url(${chatBgImg})` }}
    >
      <header className="App-header">
        <h1>Diagnostic Tool</h1>
      </header>
      {start === false ? (
        <button
          className="App-handBtn"
          onClick={() => setStart(true)}
        >
          <Image src={handBtnImage} />
        </button>
      ) : (
        <Chatbot />
      )}
    </div>
  );
}

export default App;
