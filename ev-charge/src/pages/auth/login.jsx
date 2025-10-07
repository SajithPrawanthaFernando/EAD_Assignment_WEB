// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import API from "../../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/auth/login", { email, password });
      console.log("Backend response:", response.data);

      const { token, role } = response.data;

      login(token, role, () => {
        console.log("Login callback executed");
        navigate("/overview");
      });
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f0f3f7",
      }}
    >
      {/* Left Section - EV Image & Branding */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "linear-gradient(135deg, #0d2141 0%, #315069 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          background: "linear-gradient(135deg, #0d2141, #315069)",
          p: 4,
        }}
      >
        <img
          src={logo}
          alt="EV Charging Illustration"
          style={{
            width: "75%",
            maxWidth: 450,
            marginBottom: 30,
            borderRadius: "16px",
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Smart EV Charging
        </Typography>
        <Typography
          variant="body1"
          sx={{ opacity: 0.9, textAlign: "center", maxWidth: 400 }}
        >
          Manage your stations, monitor bookings, and empower sustainable
          mobility.
        </Typography>
      </Box>

      {/* Right Section - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8f9fa",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 5,
            width: 380,
            borderRadius: 4,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            bgcolor: "#ffffff",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              textAlign: "center",
              color: "#0d2141",
              fontWeight: 700,
            }}
          >
            Login to Dashboard
          </Typography>

          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#0d2141",
                  "&:hover": { bgcolor: "#315069" },
                  py: 1.2,
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
            </Stack>
          </form>

          {message && (
            <Typography
              sx={{ mt: 2, textAlign: "center" }}
              color="error"
              variant="body2"
            >
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
