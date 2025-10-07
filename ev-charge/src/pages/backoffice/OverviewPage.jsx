import { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent, Avatar } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/api";

export default function Overview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    backofficeUsers: 0,
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
      const res = await api.get("/users"); // Fetch all users
      const users = res.data;

      setStats({
        totalUsers: users.length,
        adminUsers: users.filter(u => u.role === "Admin").length,
        backofficeUsers: users.filter(u => u.role === "Backoffice").length,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);

      // Mock data fallback
      setStats({
        totalUsers: 12,
        adminUsers: 5,
        backofficeUsers: 7,
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.white }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, bgcolor: colors.white, minHeight: "100vh", mt: 10 }}>
        {/* Header */}
        <Header />

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 4 }}>
          {/* Page Title */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ color: colors.navy, fontWeight: 600, mb: 1 }}>
              Overview Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: colors.slate }}>
              Quick stats and insights about your system. 👋
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={4}>
            {/* Total Users */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
                  <Typography variant="h3" sx={{ color: colors.navy, fontWeight: 700 }}>
                    {stats.totalUsers}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon sx={{ color: colors.green, fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: colors.green, ml: 0.5 }}>
                      +14% Since last week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Admin Users */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: colors.teal, mr: 2 }}>
                      <AdminIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Admin Users
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: colors.navy, fontWeight: 700 }}>
                    {stats.adminUsers}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon sx={{ color: colors.green, fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: colors.green, ml: 0.5 }}>
                      +8% Since last week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Backoffice Users */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: colors.slate, mr: 2 }}>
                      <PeopleIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Backoffice Users
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: colors.navy, fontWeight: 700 }}>
                    {stats.backofficeUsers}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon sx={{ color: colors.green, fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: colors.green, ml: 0.5 }}>
                      +12% Since last week
                    </Typography>
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
