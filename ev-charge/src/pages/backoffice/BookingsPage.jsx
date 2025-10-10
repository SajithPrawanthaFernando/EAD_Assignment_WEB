import { useEffect, useState } from "react";
import api from "../../api/api";
import { CheckCircle, Cancel, HourglassEmpty } from "@mui/icons-material";
import { Assignment } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  InputAdornment,
  Chip,
} from "@mui/material";

import {
  Search,
  AddCircleOutline as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as BookingIcon,
  CheckCircle as ActiveIcon,
  Cancel as CancelIcon,
  AddCircle as AddCircleIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

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
const getStatusStyle = (status) => {
  switch (status) {
    case "Cancelled":
      return { color: "#FFEBEE", bgcolor: "#D32F2F" };
    case "Completed":
      return { color: "#E8F5E9", bgcolor: "#2E7D32" };
    case "Approved":
      return { color: "#E3F2FD", bgcolor: "#1565C0" };
    default:
      return { color: "#ECEFF1", bgcolor: "#455A64" };
  }
};

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [ownerNic, setOwnerNic] = useState("");
  const [stationId, setStationId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [startTimeUtc, setStartTimeUtc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  //  Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  //  Validation helpers
  const isWithin7Days = (reservationTime) => {
    const now = new Date();
    const resTime = new Date(reservationTime);
    const diff = resTime - now;
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return diff >= 0 && diff <= sevenDays;
  };

  const isMoreThan12HoursAway = (reservationTime) => {
    const now = new Date();
    const resTime = new Date(reservationTime);
    const diffHours = (resTime - now) / (1000 * 60 * 60);
    return diffHours >= 12;
  };

  //  Save or update booking
  const saveBooking = async () => {
    if (!ownerNic || !stationId || !slotId || !startTimeUtc) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isWithin7Days(startTimeUtc)) {
      toast.error("Reservation must be within 7 days from today");
      return;
    }

    const payload = {
      ownerNic,
      stationId,
      slotId,
      startTimeUtc,
    };

    try {
      if (editMode && editingId) {
        // Check if reservation is at least 12 hours away
        const original = bookings.find((b) => b.id === editingId);
        if (!isMoreThan12HoursAway(original.startTimeUtc)) {
          toast.error("Cannot update a reservation less than 12 hours away");
          return;
        }

        const updatePayload = {
          id: editingId,
          ...payload,
        };
        await api.patch(`/bookings`, updatePayload);
        toast.success("Booking updated successfully");
      } else {
        await api.post("/bookings", payload);
        toast.success("Booking created successfully");
      }
    } catch (err) {
      console.error("Error saving booking:", err.response?.data || err.message);
      toast.error("Failed to save booking");
    }
  };

  // Approve Booking
  const approveBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/approve`);
      toast.success("Booking approved successfully");
      fetchBookings();
    } catch (err) {
      console.error("Error approving booking:", err);
      toast.error("Failed to approve booking");
    }
  };

  // Start Charging Booking
  const startChargingBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/start-charging`);
      toast.success("Charging started successfully");
      fetchBookings();
    } catch (err) {
      console.error("Error starting charging:", err);
      toast.error("Failed to start charging");
    }
  };

  // Complete Booking
  const completeBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/complete`);
      toast.success("Booking completed successfully");
      fetchBookings();
    } catch (err) {
      console.error("Error completing booking:", err);
      toast.error("Failed to complete booking");
    }
  };
  //  Delete (Cancel) booking
  const deleteBooking = async (b) => {
    if (!isMoreThan12HoursAway(b.startTimeUtc)) {
      toast.error("Cannot cancel a reservation less than 12 hours away");
      return;
    }

    try {
      await api.delete(`/bookings/${b.id}`);
      toast.success("Booking canceled successfully");
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
      toast.error("Failed to cancel booking");
    }
  };

  //  Reset form
  const resetForm = () => {
    setOwnerNic("");
    setStationId("");
    setSlotId("");
    setStartTimeUtc("");
    setEditMode(false);
    setEditingId(null);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.ownerNic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.stationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slotId?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (b) => (b.status?.toLowerCase() || "") === "approved"
  ).length;
  const canceledBookings = bookings.filter(
    (b) => (b.status?.toLowerCase() || "") === "cancelled"
  ).length;
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.white }}>
      <Sidebar />
      <Box
        sx={{ flexGrow: 1, bgcolor: colors.white, minHeight: "100vh", mt: 8 }}
      >
        <Header />

        <Box sx={{ flexGrow: 1, p: 4 }}>
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Header Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{ color: colors.navy, fontWeight: 600, mb: 1 }}
            >
              Booking Management
            </Typography>
            <Typography variant="body2" sx={{ color: colors.slate }}>
              Manage EV charging bookings with reservation validations ⚡
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
                      <BookingIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Total Bookings
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {totalBookings}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon
                      sx={{ color: colors.green, fontSize: 16 }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: colors.green, ml: 0.5 }}
                    >
                      +10% Since last week
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
                      <ActiveIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Active Bookings
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {activeBookings}
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
                    <Avatar sx={{ bgcolor: colors.red, mr: 2 }}>
                      <CancelIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ color: colors.slate }}>
                      Cancelled Bookings
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.navy, fontWeight: 700 }}
                  >
                    {canceledBookings}
                  </Typography>
                  <Chip
                    label="Cancelled"
                    size="small"
                    sx={{
                      bgcolor: colors.red,
                      color: colors.white,
                      mt: 1,
                      fontWeight: 600,
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* Add / Edit Booking Form */}
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AddIcon sx={{ color: colors.navy, mr: 1 }} />
                <Typography variant="h6" sx={{ color: colors.navy }}>
                  {editMode ? "Update Booking" : "Add New Booking"}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Owner NIC"
                    value={ownerNic}
                    onChange={(e) => setOwnerNic(e.target.value)}
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
                    label="Station ID"
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
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
                    label="Slot ID"
                    value={slotId}
                    onChange={(e) => setSlotId(e.target.value)}
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
                    type="datetime-local"
                    label="Start Time"
                    InputLabelProps={{ shrink: true }}
                    value={startTimeUtc}
                    onChange={(e) => setStartTimeUtc(e.target.value)}
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
                    onClick={saveBooking}
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

          {/* Booking Table */}
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ color: colors.navy, mb: 3, fontWeight: 600 }}
              >
                Booking List
              </Typography>

              <TextField
                placeholder="Search by Owner NIC, Station ID or Slot ID..."
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
                        Owner NIC
                      </TableCell>
                      <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                        Station ID
                      </TableCell>
                      <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                        Slot ID
                      </TableCell>
                      <TableCell sx={{ color: colors.navy, fontWeight: 600 }}>
                        Start Time (UTC)
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
                    {filteredBookings.map((b) => (
                      <TableRow
                        key={b.id}
                        sx={{
                          "&:hover": { bgcolor: colors.lightGrey },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell>{b.ownerNic}</TableCell>
                        <TableCell>{b.stationId}</TableCell>
                        <TableCell>{b.slotId}</TableCell>
                        <TableCell>
                          {new Date(b.startTimeUtc).toLocaleString()}
                        </TableCell>

                        {/*  Status Cell */}
                        <TableCell>
                          <Chip
                            label={b.status}
                            sx={{
                              ...getStatusStyle(b.status),
                              fontWeight: 600,
                              borderRadius: "15px",
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {/* Approve */}
                          <Tooltip title="Approve Booking">
                            <IconButton
                              size="small"
                              onClick={() => approveBooking(b.id)}
                              sx={{ color: colors.green, mr: 1 }}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Start Charging */}
                          <Tooltip title="Start Charging">
                            <IconButton
                              size="small"
                              onClick={() => startChargingBooking(b.id)}
                              sx={{ color: colors.blue, mr: 1 }}
                            >
                              <ToggleOnIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Complete */}
                          <Tooltip title="Complete Booking">
                            <IconButton
                              size="small"
                              onClick={() => completeBooking(b.id)}
                              sx={{ color: colors.teal, mr: 1 }}
                            >
                              <Assignment fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Edit */}
                          <Tooltip title="Edit Booking">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setOwnerNic(b.ownerNic);
                                setStationId(b.stationId);
                                setSlotId(b.slotId);
                                setStartTimeUtc(b.startTimeUtc.slice(0, 16));
                                setEditingId(b.id);
                                setEditMode(true);
                              }}
                              sx={{ color: colors.blue, mr: 1 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {/* Delete  */}
                          <Tooltip title="Cancel Booking">
                            <IconButton
                              size="small"
                              onClick={() => deleteBooking(b)}
                              sx={{ color: colors.red }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
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
