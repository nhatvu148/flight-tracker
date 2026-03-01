import { Routes, Route } from "react-router-dom";

function Home() {
  return <div>Flight Tracker Mobile — coming soon</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
