import { Router, Route, Routes } from "react-router-dom";
import HomePages from "./pages/HomePages";
import ChatPages from "./pages/ChatPages";
import "./App.css"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={HomePages} />
        <Route path="/chat" Component={ChatPages} />
      </Routes>
    </div>
  );
}

export default App;
