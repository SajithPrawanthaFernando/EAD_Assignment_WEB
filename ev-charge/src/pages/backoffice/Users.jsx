import { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Tooltip,
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {
  Search,
  PersonAdd,
  People,
  AdminPanelSettings,
  Menu,
  Person,
  EvStation,
  BookOnline,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../api/api";
import Header from "../../components/Header";
import Avatar from "@mui/material/Avatar";
import AdminIcon from "@mui/icons-material/AdminPanelSettings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Sidebar from "../../components/Sidebar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Backoffice");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      // Mock data for demonstration
    }
  };

  const addUser = async () => {
    try {
      await api.post("/users", { email, role });
       toast.success("User added successfully");
      setEmail("");
      setRole("");
      fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
       toast.success("User added successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on searchTerm
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roles?.join(" ").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.ownerNic || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.roles == "Backoffice").length;
  const evOwners = users.filter((u) => u.roles == "EVOwner").length;

  const drawerWidth = sidebarOpen ? 240 : 80;

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

  // Sidebar Links

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.white }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{ flexGrow: 1, bgcolor: colors.white, minHeight: "100vh", mt: 8 }}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 4 }}>
          {/* Header Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              sx={{ color: colors.navy, fontWeight: 600, mb: 1 }}
            >
              User Management Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: colors.slate }}>
              Welcome back! Manage your users efficiently. 👋
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={9} sx={{ mb: 5 }}>
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
                    <Avatar sx={{ bgcolor: colors.blue, mr: 2 }}></Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Total Users
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {totalUsers}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon
                      sx={{ color: colors.green, fontSize: 16 }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: colors.green, ml: 0.5 }}
                    >
                      +14% Since last week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      width: "350px",
                    }}
                  >
                    <Avatar sx={{ bgcolor: colors.teal, mr: 2 }}>
                      <AdminIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Admin Users
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {adminUsers}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon
                      sx={{ color: colors.green, fontSize: 16 }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: colors.green, ml: 0.5 }}
                    >
                      +8% Since last week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      width: "350px",
                    }}
                  >
                    <Avatar sx={{ bgcolor: colors.slate, mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      EV Owners
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {evOwners}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon
                      sx={{ color: colors.green, fontSize: 16 }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: colors.green, ml: 0.5 }}
                    >
                      +12% Since last week
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Add User Form */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              bgcolor: colors.white, // ✅ White background
              mt: 4,
              mx: 0, // ✅ Horizontal margin
            }}
          >
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <PersonAdd sx={{ color: "#315069" }} />
                <Typography variant="h6" fontWeight="600" color="#0d2141">
                  Add User
                </Typography>
              </Box>
              <Box
                component="form"
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  mt: 4,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f5f5f5", // ✅ light grey background (replace with colors.lightGrey if you have a colors object)
                    borderRadius: 2, // ✅ rounded corners
                  },
                }}
              >
                {/* Email Field */}
                <TextField
                  label="Email"
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                />

                {/* Role Dropdown */}
                <TextField
                  select
                  label="roles"
                  defaultValue="Backoffice"
                  variant="outlined"
                  size="small"
                  sx={{ width: 200 }}
                >
                  <MenuItem value="Backoffice">Backoffice</MenuItem>
                  <MenuItem value="EVOwner">EV Owner</MenuItem>
                  <MenuItem value="StationOperator">Station Operator</MenuItem>
                </TextField>
                <TextField
                  label="NIC"
                  variant="outlined"
                  size="small"
                  sx={{ width: 200 }}
                ></TextField>
                {/* Add User Button */}
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#133E87",
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#0F2E68" },
                  }}
                >
                  Add User
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* User List */}
          {/* User List */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              bgcolor: colors.white,
              mt: 4,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: colors.navy, mb: 3, fontWeight: 600 }}
              >
                User List
              </Typography>
              <TextField
                placeholder="Search by email, role, or owner NIC..."
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: colors.lightGrey,
                  },
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent page reload
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: colors.slate }} />
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{ px: 3, pb: 3, mr: 2, borderRadius: 2, overflow: "hidden" }}
            >
              <Table sx={{ borderRadius: 3, ml: 1, width: "95%" }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: colors.lightGrey }}>
                    <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                      NIC
                    </TableCell>
                    <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                      Status
                    </TableCell>

                    <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        "&:hover": { bgcolor: colors.lightGrey },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell align="left">{user.email}</TableCell>
                      <TableCell align="left">{user.roles}</TableCell>
                      <TableCell align="left">{user.ownerNic}</TableCell>

                      {/* Status Column with Toggle */}
                      <TableCell>
                        {user && (
                          <Chip
                            label={user.active ? "active" : "inactive"}
                            size="small"
                            sx={{
                              bgcolor: user.active ? colors.green : colors.red,
                              color: colors.white,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell align="left">
                        {/* Edit Icon */}
                        <IconButton
                          size="small"
                          sx={{ color: colors.teal, mr: 1 }}
                          onClick={() => handleEdit(user)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        {/* Delete Icon */}
                        <IconButton
                          size="small"
                          sx={{ color: colors.red }}
                          onClick={() => handleDelete(user.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
