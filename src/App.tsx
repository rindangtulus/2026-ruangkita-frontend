import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import BorrowingList from "./pages/BorrowingList";
import Rooms from "./pages/Rooms";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setActivePage("dashboard");
  };

  if (!user) {
    return isRegistering ? (
      <Register onBackToLogin={() => setIsRegistering(false)} />
    ) : (
      <Login
        onLoginSuccess={(userData) => setUser(userData)}
        onGoToRegister={() => setIsRegistering(true)}
      />
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard setActivePage={setActivePage} user={user} />;
      case "borrowing-list":
        return <BorrowingList user={user} />;
      case "rooms":
        return user.role === "Admin" ? (
          <Rooms />
        ) : (
          <Dashboard user={user} setActivePage={setActivePage} />
        );
      default:
        return <Dashboard user={user} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-x-hidden">{renderPage()}</main>
    </div>
  );
}
