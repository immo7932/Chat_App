import { Router, Route, Routes } from "react-router-dom";
import HomePages from "./pages/HomePages";
import ChatPages from "./pages/ChatPages";
import "./App.css"
import Loginpage from "./components/Authentication/Login.js"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={HomePages} />
        <Route path="/chats" Component={ChatPages} />
        {/* <Route path="/login" Component={Loginpage} /> */}
      </Routes>
    </div>
  );
}

export default App;
