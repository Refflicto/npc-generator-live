import "./App.css";

import Generator from "./components/Generator";

function App() {
  return (
    <div className="App content">
      <div className="container">
        <div className="text-center m-2 p-2 rounded-3 title">
          <h1>NPC Generator</h1>
        </div>
        <Generator />
      </div>
    </div>
  );
}

export default App;
