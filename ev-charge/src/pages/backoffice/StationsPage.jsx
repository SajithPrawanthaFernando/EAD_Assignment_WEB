import { useEffect, useState } from "react";
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
  MenuItem,
  Avatar,
} from "@mui/material";

import {
  Search,
  AddCircleOutline as AddIcon,
  Edit as EditIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  ListAlt as TotalIcon,
} from "@mui/icons-material";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import api from "../../api/api";

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

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("AC");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [slots, setSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchStations = async () => {
    try {
      const res = await api.get("/stations");
      setStations(res.data);
    } catch (err) {
      console.error("Error fetching stations:", err);
      toast.error("Failed to fetch stations");
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const saveStation = async () => {
    if (!name || !type || !lat || !lng || slots.length === 0) {
      toast.error("Please fill in all fields");
      return;
    }

    const payload = {
      id: editingId,
      name,
      type,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      slots: slots.map((s) => ({
        slotId: s.slotId || `${Math.random()}`,
        label: s.label,
        available: s.available !== undefined ? s.available : true,
      })),
    };

    // Add this mapping at the top of your component or in a separate constants file
    const TYPE_MAPPING = {
      DC: 2,
      AC: 1,
      // Add other types as needed
    };

    // When preparing the payload for API:
    const preparePayloadForAPI = (formData) => {
      return {
        ...formData,
        type: TYPE_MAPPING[formData.type] || formData.type,
      };
    };

    // In your save function:
    try {
      const apiPayload = preparePayloadForAPI(payload);
      console.log("Payload being sent:", apiPayload);

      if (editMode) {
        await api.put("/stations", apiPayload);
        toast.success("Station updated successfully");
      } else {
        await api.post("/stations", apiPayload);
        toast.success("Station added successfully");
      }
      resetForm();
      fetchStations();
    } catch (err) {
      console.error("Error saving station:", err);
      console.error("Response data:", err.response?.data);
      toast.error("Failed to save station");
    }
  };
  const toggleActive = async (station) => {
    try {
      if (station.active) {
        await api.patch(`/stations/${station.id}/deactivate`);
        toast.info("Station deactivated");
      } else {
        await api.patch(`/stations/${station.id}/activate`);
        toast.success("Station activated");
      }
      fetchStations();
    } catch (err) {
      console.error("Error toggling station:", err);
      toast.error("Failed to toggle station");
    }
  };

  const resetForm = () => {
    setName("");
    setType("AC");
    setLat("");
    setLng("");
    setSlots([]);
    setEditMode(false);
    setEditingId(null);
  };

  const filteredStations = stations.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Card stats
  const totalStations = stations.length;
  const activeStations = stations.filter((s) => s.active).length;
  const inactiveStations = stations.filter((s) => !s.active).length;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.white }}>
      <Sidebar />
      <Box
        sx={{ flexGrow: 1, bgcolor: colors.white, minHeight: "100vh", mt: 8 }}
      >
        <Header title="Stations" />
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <ToastContainer position="top-right" autoClose={3000} />
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{ color: colors.navy, fontWeight: 600, mb: 1 }}
            >
              Station Management
            </Typography>
            <Typography variant="body2" sx={{ color: colors.slate }}>
              Manage EV charging stations ⚡
            </Typography>
          </Box>
          {/* Stats Cards */}
          <Grid container spacing={8} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  width: "350px",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: colors.blue, mr: 2 }}>
                      <TotalIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Total Stations
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {totalStations}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  width: "350px",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: colors.green, mr: 2 }}>
                      <ActiveIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Active Stations
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {activeStations}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  bgcolor: colors.lightGrey,
                  borderRadius: 3,
                  width: "350px",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: colors.red, mr: 2 }}>
                      <InactiveIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Inactive Stations
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {inactiveStations}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Add/Edit Station Form */}
          <Card sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AddIcon sx={{ color: colors.navy, mr: 1 }} />
                <Typography variant="h6" sx={{ color: colors.navy }}>
                  {editMode ? "Update Station" : "Add New Station"}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Station Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: colors.lightGrey,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: colors.lightGrey,
                        borderRadius: 2,
                      },
                    }}
                  >
                    <MenuItem value="AC">AC</MenuItem>
                    <MenuItem value="DC">DC</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: colors.lightGrey,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: colors.lightGrey,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Slots (comma-separated labels)"
                    value={slots.map((s) => s.label).join(", ")}
                    onChange={(e) =>
                      setSlots(
                        e.target.value.split(",").map((label, i) => ({
                          slotId: `${i + 1}`,
                          label: label.trim(),
                          available: true,
                        }))
                      )
                    }
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: colors.lightGrey,
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={saveStation}
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
            </CardContent>
          </Card>

          {/* Stations Grid */}
          <Grid container spacing={3} justifyContent="center">
            {filteredStations.map((s) => (
              <Grid item key={s.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    width: 400, // ✅ fixed width
                    height: 250, // optional: makes boxes uniform height
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: colors.navy, mb: 1 }}
                    >
                      {s.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.slate }}>
                      Type: {s.type}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.slate }}>
                      Location: ({s.lat}, {s.lng})
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.slate, mt: 1 }}
                    >
                      Slots:{" "}
                      {Array.isArray(s.slots)
                        ? s.slots.map((slot) => slot.label).join(", ")
                        : s.slots}
                    </Typography>

                    <Chip
                      label={s.active ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        bgcolor: s.active ? colors.green : colors.red,
                        color: colors.white,
                        fontWeight: 600,
                        mt: 1,
                      }}
                    />
                  </CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{ color: colors.blue }}
                      onClick={() => {
                        setName(s.name);
                        setType(s.type);
                        setLat(s.lat);
                        setLng(s.lng);
                        setSlots(s.slots);
                        setEditingId(s.id);
                        setEditMode(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      sx={{ color: s.active ? colors.red : colors.green }}
                      onClick={() => toggleActive(s)}
                    >
                      {s.active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
