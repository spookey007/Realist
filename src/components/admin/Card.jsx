// src/components/ui/Card.jsx
import React from "react";
import { Card as MuiCard, CardContent, Typography } from "@mui/material";

const Card = ({ title, children }) => {
    return (
      <MuiCard className="p-4 rounded-lg shadow-lg">
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          {children}
        </CardContent>
      </MuiCard>
    );
  };
  
export default Card;
