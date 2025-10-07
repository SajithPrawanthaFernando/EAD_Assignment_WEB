import React from "react";
import { Card as MUICard, CardContent, Typography } from "@mui/material";

export default function Card({ title, value }) {
  return (
    <MUICard sx={{ minWidth: 200, margin: 1, backgroundColor: "#F8F9FA" }}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </MUICard>
  );
}
