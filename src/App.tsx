import { BrowserRouter, Routes, Route } from "react-router-dom";
import TianDiTu from "./pages/tianditu";
import Geojson from "./pages/geojson";
import Pbf from "./pages/pbf";
import Mark from "./pages/mark";
import Thumbnail from "./pages/thumbnail";
import Lerc from "./pages/lerc";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tianditu" element={<TianDiTu />} />
        <Route path="/geojson" element={<Geojson />} />
        <Route path="/pbf" element={<Pbf />} />
        <Route path="/mark" element={<Mark />} />
        <Route path="/thumbnail" element={<Thumbnail />} />
        <Route path="/lerc" element={<Lerc />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
