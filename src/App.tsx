import { Routes, Route } from "react-router-dom";
import Home from "./Home"; // Your splash screen + game (previous App stuff)
import Shop from "./Shop"; // Your new shop page

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
    </Routes>
  );
}

export default App;
