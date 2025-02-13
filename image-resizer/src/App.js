import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainComponent from "./MainComponent";  // Import the main component
import Callback from "./Callback";  // Import the callback handler

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/callback" element={<Callback />} />  {/* 🔹 Add callback route */}
      </Routes>
    </Router>
  );
}

export default App;
