import { Button } from "@chakra-ui/react";
import "./App.css";
import Home from "./Components/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatPage from "./Components/ChatPage";
import UnAuthorizePage from "./Components/UnAuthorize/UnAuthorizePage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path={"/"} element={<Home />} exact />
          <Route path={"/chatpage"} element={<ChatPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
