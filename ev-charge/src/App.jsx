import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Users from "./pages/backoffice/Users";
import EVOwners from "./pages/backoffice/EVOwnersPage";
import Stations from "./pages/backoffice/StationsPage";
import useAuth from "./hooks/useAuth";
import Overview from "./pages/backoffice/OverviewPage";
function App() {
    const { user } = useAuth();
  const token = localStorage.getItem("token");

  // PrivateRoute wrapper with roles
  const PrivateRoute = ({ children, roles }) => {
    if (!token || !user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Backoffice routes */}
        <Route
          path="/users"
          element= {<Users />}  />
        <Route
          path="/ev-owners"
          element={<EVOwners/>}/>
        
<Route
          path="/ev-owners"
          element={
            <PrivateRoute roles={["Backoffice"]}>
              <EVOwners />
            </PrivateRoute>
          }
        />
        <Route
  path="/overview"
  element={
    <PrivateRoute>
      <Overview />
    </PrivateRoute>
  }
/>

        </Routes>
        
    </Router>
  );
}

export default App;
