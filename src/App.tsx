import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import BorrowingList from "./pages/BorrowingList";
import Rooms from "./pages/Rooms";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard setActivePage={setActivePage} />;
      case "borrowing-list":
        return <BorrowingList />;
      case "rooms":
        return <Rooms />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1">{renderPage()}</main>
    </div>
  );
}

export default App;
