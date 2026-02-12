import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <main>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />

        {activePage === "dashboard" ? <Dashboard /> : <Rooms />}
      </div>
    </main>
  );
}

export default App;
