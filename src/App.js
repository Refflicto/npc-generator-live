import "./App.css";
import AdSense from "react-adsense";
import AdComponent from "./components/AdComponent";

import ReactGA from "react-ga";

import Generator from "./components/Generator";
import d20Logo from "./images/d20.png";

const TRACKING_ID = "UA-245449149-2";
ReactGA.initialize(TRACKING_ID);

function App() {
  return (
    <div className="App content">
      <div className="container">
        <div className="text-center m-2 p-2 rounded-3 title">
          <h1>
            <img src={d20Logo} style={{ height: "1em" }} />
            &nbsp;&nbsp;&nbsp;NPC Generator&nbsp;&nbsp;&nbsp;
            <img src={d20Logo} style={{ height: "1em" }} />
          </h1>
        </div>
        <div></div>
        {/* <AdComponent path="test" /> */}
        {/* <AdSense.Google client="ca-pub-8996586400495676" slot="8142577961" /> */}
        <Generator />
      </div>
    </div>
  );
}

export default App;
