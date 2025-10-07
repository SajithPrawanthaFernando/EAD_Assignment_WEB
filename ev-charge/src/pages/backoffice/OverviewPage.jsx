import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PeopleIcon from "@mui/icons-material/People";
import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

export default function Overview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    backofficeUsers: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalOwners: 0,
    activeOwners: 0,
    totalStations: 0,
    activeStations: 0,
  });

  const colors = {
    navy: "#0d2141",
    teal: "#315069",
    slate: "#6e7989",
    lightGrey: "#F8F9FA",
    white: "#FFFFFF",
    blue: "#4A90E2",
    green: "#4CAF50",
    red: "#F44336",
  };

  const fetchStats = async () => {
    try {
      const [userRes, bookingRes, ownerRes, stationRes] = await Promise.all([
        api.get("/users"),
        api.get("/bookings"),
        api.get("/ev-owners"),
        api.get("/stations"),
      ]);

      const users = userRes.data;
      const bookings = bookingRes.data;
      const owners = ownerRes.data;
      const stations = stationRes.data;

      setStats({
        totalUsers: users.length,
        adminUsers: users.filter((u) => u.role === "Backoffice").length,
        backofficeUsers: users.filter((u) => u.role === "Backoffice").length,
        totalBookings: bookings.length,
        activeBookings: bookings.filter((b) => b.status === "Active").length,
        totalOwners: owners.length,
        activeOwners: owners.filter((o) => o.active).length,
        totalStations: stations.length,
        activeStations: stations.filter((s) => s.active).length,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Mock data fallback
      setStats({});
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Pie Chart Data
  const bookingData = [
    { name: "Active", value: stats.activeBookings },
    { name: "Inactive", value: stats.totalBookings - stats.activeBookings },
  ];

  const ownerData = [
    { name: "Active", value: stats.activeOwners },
    { name: "Inactive", value: stats.totalOwners - stats.activeOwners },
  ];

  const stationData = [
    { name: "Active", value: stats.activeStations },
    { name: "Inactive", value: stats.totalStations - stats.activeStations },
  ];

  // Use dark blue and grey
  const PIE_COLORS = [colors.navy, colors.slate];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.white }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{ flexGrow: 1, bgcolor: colors.white, minHeight: "100vh", mt: 4 }}
      >
        <Header />

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography
            variant="h5"
            sx={{ color: colors.navy, fontWeight: 600, mt: 3 }}
          >
            Overview Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: colors.slate, mb: 3 }}>
            Manage EV charging bookings with real-time insights and reservation
            validations ⚡
          </Typography>
          {/* Top Stats */}
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  width: "350px",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: colors.blue, mr: 2 }}>
                      <PeopleIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Total Users
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {stats.totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  width: "350px",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: colors.teal, mr: 2 }}>
                      <AdminIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Total Bookings
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {stats.totalBookings}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  width: "350px",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: colors.slate, mr: 2 }}>
                      <PeopleIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Total Stations
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {stats.totalStations}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Pie Charts Section */}
          <Typography
            variant="h5"
            sx={{ color: colors.navy, fontWeight: 600, mt: 6, mb: 2 }}
          >
            System Analytics
          </Typography>

          <Grid container spacing={4}>
            {/* Bookings */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: colors.blue, mr: 2 }}>
                      <BookOnlineIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Bookings
                    </Typography>
                  </Box>
                  <Box sx={{ width: 350, height: 250, mx: "auto" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bookingData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          label
                        >
                          {bookingData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* EV Owners */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  width: "350px",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: colors.teal, mr: 2 }}>
                      <PeopleIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      EV Owners
                    </Typography>
                  </Box>
                  <Box sx={{ width: 350, height: 250, mx: "auto" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ownerData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          label
                        >
                          {ownerData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Stations */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: colors.slate, mr: 2 }}>
                      <LocalGasStationIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Stations
                    </Typography>
                  </Box>
                  <Box sx={{ width: 350, height: 250, mx: "auto" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stationData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          label
                        >
                          {stationData.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
