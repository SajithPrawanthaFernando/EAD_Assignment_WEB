import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import BookingTable from "../../components/BookingTable";
import api from "../../api/api";
import { Container, Paper, Typography } from "@mui/material";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  const sidebarLinks = [
    { text: "Users", path: "/backoffice/users" },
    { text: "EV Owners", path: "/backoffice/ev-owners" },
    { text: "Stations", path: "/backoffice/stations" },
    { text: "Bookings", path: "/backoffice/bookings" },
  ];

  const fetchBookings = async () => {
    const res = await api.get("/bookings");
    setBookings(res.data);
  };

  const handleEdit = (booking) => {
    alert("Implement edit form or modal for booking ID: " + booking.id);
  };

  const handleCancel = async (booking) => {
    try {
      await api.delete(`/bookings/${booking.id}`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot cancel booking within 12 hours");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar links={sidebarLinks} />
      <Container sx={{ ml: 30, mt: 3 }}>
        <Header title="Bookings" />
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">Booking List</Typography>
          <BookingTable bookings={bookings} onEdit={handleEdit} onCancel={handleCancel} />
        </Paper>
      </Container>
    </div>
  );
}
