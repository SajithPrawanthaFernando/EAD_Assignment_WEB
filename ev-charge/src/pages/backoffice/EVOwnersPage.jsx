import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Tooltip,
  InputAdornment,
} from "@mui/material";

import {
  Search,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  DirectionsCar as CarIcon,
} from "@mui/icons-material";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export default function EVOwnersPage() {
  const [owners, setOwners] = useState([]);
  const [nic, setNic] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [active, setActive] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const saveOwner = async () => {
    if (!validateFields()) {
      toast.error("Please fix the form errors");
      return;
    }
    if (!nic || !name || !phone || !email) {
      toast.error("Please fill in NIC, Name, Phone, and Email");
      return;
    }

    if (!editMode && !password) {
      toast.error("Password is required for new owners");
      return;
    }

    try {
      const payload = {
        nic,
        name,
        phone,
        email,
        ...(editMode ? {} : { password }),
      };

      await api.put("/ev-owners", payload);

      resetForm();
      fetchOwners();
      toast.success(
        editMode ? "Owner updated successfully" : "Owner created successfully"
      );
    } catch (err) {
      console.error("Error saving owner:", err.response?.data || err.message);
      toast.error("Failed to save owner");
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await api.get("/ev-owners");
      setOwners(res.data);
    } catch (err) {
      console.error("Error fetching owners:", err);
      toast.error("Failed to fetch owners");
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const resetForm = () => {
    setNic("");
    setName("");
    setPhone("");
    setEmail("");
    setActive(true);
    setPassword("");
    setEditMode(false);
  };
  // Validation state
  const [errors, setErrors] = useState({
    nic: "",
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const validateFields = () => {
    let newErrors = { nic: "", name: "", phone: "", email: "", password: "" };
    let valid = true;

    if (!/^(?:\d{9}[VvXx]|\d{12})$/.test(nic)) {
      newErrors.nic = "Enter a valid NIC (e.g. 123456789V or 12 digits)";
      valid = false;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters and spaces";
      valid = false;
    }
    if (!/^0\d{9}$/.test(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number (e.g. 0712345678)";
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }
    if (!editMode && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const deleteOwner = async (nic) => {
    try {
      await api.delete(`/ev-owners/${nic}`);
      fetchOwners();
      toast.success("Owner deleted successfully");
    } catch (err) {
      console.error("Error deleting owner:", err);
      toast.error("Failed to delete owner");
    }
  };

  const toggleActive = async (owner) => {
    try {
      if ((owner.status?.toLowerCase() || "") === "active") {
        await api.patch(`/ev-owners/${owner.nic}/deactivate`);
        toast.info("Owner deactivated");
      } else {
        await api.patch(`/ev-owners/${owner.nic}/reactivate`);
        toast.success("Owner activated");
      }
      fetchOwners();
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error("Failed to update owner status");
    }
  };

  const totalOwners = owners.length;
  const activeOwners = owners.filter(
    (o) => (o.status?.toLowerCase() || "") === "active"
  ).length;
  const inactiveOwners = totalOwners - activeOwners;

  const filteredUsers = owners.filter(
    (owner) =>
      (owner.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (owner.nic?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.white }}>
      <Sidebar />
      <Box
        sx={{ flexGrow: 1, bgcolor: colors.white, minHeight: "100vh", mt: 8 }}
      >
        <Header />

        <Box sx={{ flexGrow: 1, p: 4 }}>
          {/* Toastify Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
          />
          {/* Header Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{ color: colors.navy, fontWeight: 600, mb: 1 }}
            >
              EV Owners Dashboard
            </Typography>
            <Typography variant="body2" sx={{ color: colors.slate }}>
              Manage your EV owners efficiently. 👋
            </Typography>
          </Box>
          {/* Stats Cards */}
          <Grid container spacing={12} sx={{ mb: 5 }}>
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
                    <Avatar sx={{ bgcolor: colors.blue, mr: 2 }}>
                      <PeopleIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Total Owners
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {totalOwners}
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
                    <Avatar sx={{ bgcolor: colors.green, mr: 2 }}>
                      <CarIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Active Owners
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {activeOwners}
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{
                      bgcolor: colors.green,
                      color: colors.white,
                      mt: 1,
                      fontWeight: 600,
                    }}
                  />
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
                      <ToggleOffIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Inactive Owners
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {inactiveOwners}
                  </Typography>
                  <Chip
                    label="Inactive"
                    size="small"
                    sx={{
                      bgcolor: colors.slate,
                      color: colors.white,
                      mt: 1,
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* Add/Edit Owner Form */}{" "}
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {" "}
            <CardContent sx={{ p: 3 }}>
              {" "}
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                {" "}
                <PersonAddIcon sx={{ color: colors.navy, mr: 1 }} />{" "}
                <Typography variant="h6" sx={{ color: colors.navy }}>
                  {" "}
                  {editMode ? "Update Owner" : "Add New Owner"}{" "}
                </Typography>{" "}
              </Box>{" "}
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="NIC"
                    value={nic}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase(); // auto uppercase V
                      // Allow only 0-9 and optionally V/X at the end
                      const nicPattern = /^(?:\d{0,12}|(\d{0,9}[VX]))$/;
                      if (nicPattern.test(value)) {
                        setNic(value);
                      }
                    }}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: colors.lightGrey,
                        borderRadius: 2,
                      },
                    }}
                    error={!!errors.nic}
                    helperText={errors.nic}
                    disabled={editMode}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only letters and spaces — filter out anything else
                      if (/^[A-Za-z\s]*$/.test(value)) {
                        setName(value);
                      }
                    }}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: colors.lightGrey,
                        borderRadius: 2,
                      },
                    }}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only digits — prevent letters/symbols
                      if (/^[0-9]*$/.test(value)) {
                        setPhone(value);
                      }
                    }}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: colors.lightGrey,
                        borderRadius: 2,
                      },
                    }}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: colors.lightGrey,
                        borderRadius: 2,
                      },
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>

                {!editMode && (
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: colors.lightGrey,
                          borderRadius: 2,
                        },
                      }}
                      error={!!errors.password}
                      helperText={errors.password}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={saveOwner}
                    sx={{
                      bgcolor: colors.blue,
                      color: colors.white,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: colors.teal },
                    }}
                  >
                    {editMode ? "Update" : "Save"}
                  </Button>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={resetForm}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>{" "}
          </Card>
          {/* Owner Table */}
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: colors.navy, mb: 3, fontWeight: 600 }}
              >
                Owner List
              </Typography>
              <TextField
                placeholder="Search by email, or NIC..."
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: colors.slate }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: colors.lightGrey }}>
                      <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                        NIC
                      </TableCell>
                      <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                        Phone
                      </TableCell>
                      <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                        Email
                      </TableCell>
                      <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                        Status
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ color: colors.navy, fontWeight: 600 }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((owner) => (
                      <TableRow
                        key={owner.nic}
                        sx={{
                          "&:hover": { bgcolor: colors.lightGrey },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>{owner.nic}</TableCell>
                        <TableCell>{owner.name}</TableCell>
                        <TableCell>{owner.phone}</TableCell>
                        <TableCell>{owner.user?.email}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={owner.status || "inactive"}
                            size="small"
                            sx={{
                              bgcolor:
                                (owner.status?.toLowerCase() || "") === "active"
                                  ? colors.green
                                  : colors.red,
                              color: colors.white,
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          />{" "}
                        </TableCell>{" "}
                        <TableCell align="center">
                          {" "}
                          <Tooltip title="Edit Owner">
                            {" "}
                            <IconButton
                              size="small"
                              onClick={() => {
                                setNic(owner.nic);
                                setName(owner.name);
                                setPhone(owner.phone);
                                setEmail(owner.user?.email || "");
                                setActive(
                                  (owner.status?.toLowerCase() || "") ===
                                    "active"
                                );
                                setEditMode(true);
                              }}
                              sx={{ color: colors.blue, mr: 1 }}
                            >
                              {" "}
                              <EditIcon fontSize="small" />{" "}
                            </IconButton>{" "}
                          </Tooltip>{" "}
                          <Tooltip
                            title={
                              (owner.status?.toLowerCase() || "") === "active"
                                ? "Deactivate Owner"
                                : "Activate Owner"
                            }
                          >
                            {" "}
                            <IconButton
                              size="small"
                              onClick={() => toggleActive(owner)}
                              sx={{
                                color:
                                  (owner.status?.toLowerCase() || "") ===
                                  "active"
                                    ? colors.red
                                    : colors.green,
                                mr: 1,
                              }}
                            >
                              {" "}
                              {(owner.status?.toLowerCase() || "") ===
                              "active" ? (
                                <ToggleOffIcon fontSize="medium" />
                              ) : (
                                <ToggleOnIcon fontSize="medium" />
                              )}{" "}
                            </IconButton>{" "}
                          </Tooltip>{" "}
                          <Tooltip title="Delete Owner">
                            {" "}
                            <IconButton
                              size="small"
                              onClick={() => deleteOwner(owner.nic)}
                              sx={{ color: colors.red }}
                            >
                              {" "}
                              <DeleteIcon fontSize="small" />{" "}
                            </IconButton>{" "}
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
