import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import api from "../../api/api";
import { Container, Typography, TextField, Button, Paper } from "@mui/material";

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("AC");
  const [slots, setSlots] = useState(0);

  const sidebarLinks = [
    { text: "Users", path: "/backoffice/users" },
    { text: "EV Owners", path: "/backoffice/ev-owners" },
    { text: "Stations", path: "/backoffice/stations" },
    { text: "Bookings", path: "/backoffice/bookings" },
  ];

  const fetchStations = async () => {
    const res = await api.get("/stations");
    setStations(res.data);
  };

  const saveStation = async () => {
    await api.post("/stations", { name, type, slots });
    setName("");
    setType("AC");
    setSlots(0);
    fetchStations();
  };

  const toggleActive = async (station) => {
    try {
      await api.patch(`/stations/${station.id}/${station.active ? "deactivate" : "activate"}`);
      fetchStations();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot deactivate station with active bookings");
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar links={sidebarLinks} />
      <Container sx={{ ml: 30, mt: 3 }}>
        <Header title="Stations" />
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="h6">Add Station</Typography>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mr: 2 }} />
          <TextField label="Type" value={type} onChange={(e) => setType(e.target.value)} sx={{ mr: 2 }} />
          <TextField label="Slots" type="number" value={slots} onChange={(e) => setSlots(e.target.value)} sx={{ mr: 2 }} />
          <Button variant="contained" onClick={saveStation}>
            Save
          </Button>
        </Paper>

        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">Station List</Typography>
          {stations.map((s) => (
            <div key={s.id}>
              {s.name} - {s.type} - Slots: {s.slots} -{" "}
              <Button onClick={() => toggleActive(s)}>
                {s.active ? "Deactivate" : "Activate"}
              </Button>
            </div>
          ))}
        </Paper>
      </Container>
    </div>
  );
}
