import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Users from "./pages/backoffice/Users";
import EVOwners from "./pages/backoffice/EVOwnersPage";
import Stations from "./pages/backoffice/StationsPage";
import BookingsPage from "./pages/backoffice/BookingsPage";
import Overview from "./pages/backoffice/OverviewPage";
import Account from "./pages/AccountPage";
import useAuth from "./hooks/useAuth";

function App() {
  const { user, setUser } = useAuth(); // user state from your Auth context
  const token = localStorage.getItem("token");

  // On app load, initialize user from localStorage if not set
  React.useEffect(() => {
    if (!user && token) {
      const storedUser = JSON.parse(localStorage.getItem("user")); // store user on login
      if (storedUser) setUser(storedUser);
    }
  }, [user, token, setUser]);

  // Redirect to login if no token
  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // Logged-in routes
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to="/overview" />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/users" element={<Users />} />
        <Route path="/ev-owners" element={<EVOwners />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<Navigate to="/overview" />} />
      </Routes>
    </Router>
  );
}

export default App;
