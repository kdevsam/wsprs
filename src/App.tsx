import { Routes, Route } from "react-router-dom";
import Home from "./Home"; // Your splash screen + mainmenu
import Shop from "./Shop"; // Your new shop page
import DailyPuzzle from "./DailyPuzzle";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/daily" element={<DailyPuzzle />} />
      <Route path="/shop" element={<Shop />} />
    </Routes>
  );
}

export default App;
