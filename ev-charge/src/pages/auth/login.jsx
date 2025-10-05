// src/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Stack } from "@mui/material";
import useAuth from "../../hooks/useAuth"; // Auth context hook

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // context login function

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");

    // Mock login
    if (email === "admin@ev.local" && password === "Admin#123") {
      const mockToken = "mock-backoffice-jwt-token";
      login(mockToken, "Backoffice");
      setMessage("Login successful!");
      navigate("/backoffice/evowners");
    } else if (email === "operator@ev.local" && password === "Operator#123") {
      const mockToken = "mock-operator-jwt-token";
      login(mockToken, "StationOperator");
      setMessage("Login successful!");
      navigate("/operator");
    } else {
      setMessage("Invalid credentials");
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
          <Typography
            sx={{ mt: 2, textAlign: "center" }}
            color={message === "Login successful!" ? "green" : "error"}
          >
            {message}
          </Typography>
        )}
        <Box mt={3} textAlign="center" fontSize={12}>
          <div>Backoffice Admin: admin@ev.local / Admin#123</div>
          <div>Operator: operator@ev.local / Operator#123</div>
        </Box>
      </Paper>
    </Box>
  );
}
