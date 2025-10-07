import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Drawer,
} from "@mui/material";
import {
  People as PeopleIcon,
  DirectionsCar as CarIcon,
  EvStation as StationIcon,
  BookOnline as BookingIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 240;

const colors = {
  navy: "#0d2141",
  teal: "#315069",
  slate: "#6e7989",
  lightGrey: "#F8F9FA",
  white: "#FFFFFF",
};

const iconMap = {
  Overview: <DashboardIcon />,
  Users: <PeopleIcon />,
  "EV Owners": <CarIcon />,
  Stations: <StationIcon />,
  Bookings: <BookingIcon />,
  Companies: <BusinessIcon />,
  Account: <AccountIcon />,
  Settings: <SettingsIcon />,
};

export default function Sidebar() {
  // ✅ Sidebar navigation links (added here)
  const links = [
    { text: "Overview", path: "/overview" },
    { text: "Users", path: "/users" },
    { text: "EV Owners", path: "/ev-owners" },
    { text: "Stations", path: "/stations" },
    { text: "Bookings", path: "/bookings" },
    { text: "Account", path: "/account" },
    { text: "Settings", path: "/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: colors.navy,
          borderRight: "none",
          marginTop: "50px",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Logo/Brand */}
        <Box sx={{ p: 3, borderBottom: `1px solid ${colors.teal}` }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1.5,
              }}
            >
              <CarIcon sx={{ color: colors.white, fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: colors.white,
                fontWeight: 700,
              }}
            >
              ChargeNet
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: colors.slate, ml: 5.5 }}>
            Production
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, py: 2 }}>
          <List>
            {links.map((link) => (
              <ListItem key={link.path} disablePadding sx={{ px: 2 }}>
                <ListItemButton
                  href={link.path}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: "transparent",
                    "&:hover": {
                      bgcolor: "rgba(49, 80, 105, 0.4)",
                    },
                    "&.active": {
                      bgcolor: "rgba(49, 80, 105, 0.6)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: colors.white, minWidth: 40 }}>
                    {iconMap[link.text] || <PeopleIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={link.text}
                    primaryTypographyProps={{
                      sx: {
                        color: colors.white,
                        fontWeight: 400,
                        fontSize: 14,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
