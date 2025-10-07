// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Stack } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import API from "../../api/api"; // Make sure path is correct

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
    console.log("Backend response:", response.data); // Debug
    
    const { token, role } = response.data;

    login(token, role, () => {
      console.log("Login callback executed"); // Debug
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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 360 }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          Login
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </Stack>
        </form>
        {message && (
          <Typography sx={{ mt: 2, textAlign: "center" }} color="error">
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
