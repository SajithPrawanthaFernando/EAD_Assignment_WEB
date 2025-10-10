"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Badge,
  InputBase,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  DirectionsCar as CarIcon,
} from "@mui/icons-material";
import { alpha, styled } from "@mui/material/styles";
import useAuth from "../hooks/useAuth"; // adjust path as needed

const colors = {
  navy: "#0d2141",
  teal: "#315069",
  slate: "#6e7989",
  lightGrey: "#F8F9FA",
  white: "#FFFFFF",
};

// Modern Search Bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "20px",
  backgroundColor: alpha("#0d2141", 0.05),
  "&:hover": {
    backgroundColor: alpha("#0d2141", 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));
const goToAccount = () => {
  router.push("/account"); // navigate to account page
};

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#315069",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: colors.navy,
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 4),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "200px",
      "&:focus": { width: "300px" },
    },
  },
}));

export default function Header({ title }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: colors.white,
        color: colors.navy,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Section: Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 35 }}>
          <CarIcon sx={{ color: colors.navy, fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{
              color: colors.navy,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            ChargeNet
          </Typography>
        </Box>

        {/* Right Section: Search + Notifications + Profile + Logout */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Search */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          {/* Notifications */}
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton color="inherit" onClick={goToAccount}>
            <AccountCircle fontSize="large" />
          </IconButton>

          {/* Logout */}
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              ml: 1,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: "#133E87",
              "&:hover": { bgcolor: "#0F2E68" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
