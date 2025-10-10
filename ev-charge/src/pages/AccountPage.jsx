import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import api from "../api/api";
import img from "../assets/images/account.png";
const colors = {
  navy: "#0d2141",
  teal: "#315069",
  lightGrey: "#f5f5f5",
};

// Helper function to decode JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

const AccountPage = () => {
  const { user: authUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      // Decode JWT to get user ID
      const decodedToken = decodeJWT(token);
      console.log("Decoded token:", decodedToken);

      const userId = decodedToken?.sub;

      if (!userId) {
        console.log("No user ID in token");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching user with ID:", userId);
        const res = await api.get(`/users/${userId}`);
        console.log("User data received:", res.data);
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        console.error("Error response:", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authUser]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography color="error">Failed to load user data.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.lightGrey }}
    >
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Header />

        <Box sx={{ py: 4, mt: 5 }}>
          <Container sx={{ width: "500px" }}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={6} sx={{ width: "800px" }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "white",
                    borderRadius: 3,
                  }}
                >
                  <Avatar src={img} sx={{ width: 120, height: 120, mb: 2 }} />
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 600, mb: 1 }}
                  >
                    {userData.name || userData.username || "User"}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: colors.navy, mb: 1 }}
                  >
                    Role: {"Admin"}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#6e7989", mb: 2 }}>
                    Email: {userData.email}
                  </Typography>

                  <Divider sx={{ width: "100%", my: 2 }} />

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: colors.teal,
                      "&:hover": { bgcolor: colors.navy },
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountPage;
