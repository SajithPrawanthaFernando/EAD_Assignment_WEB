"use client"

import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material"
import { Search as SearchIcon, Notifications as NotificationsIcon, AccountCircle } from "@mui/icons-material"

export default function Header({ title, onLogout }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#ffffff",
        color: "#0d2141",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          {title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <Button
            color="inherit"
            onClick={onLogout}
            sx={{
              ml: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
