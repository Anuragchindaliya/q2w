import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path=":roomIdPath" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
