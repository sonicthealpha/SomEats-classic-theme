import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
  Typography
} from "@mui/material";
import React from "react";

const ResPlaceholder = ({ number }) => {
  const n = number;
  return [...Array(n)].map((elem, index) => (
    <span key={index}>
      <Card
        variant="outlined"
        sx={{
          maxWidth: 365,
          borderRadius: "15px",
          marginRight: "5px",
          marginBottom: "10px",
          marginTop: "10px",
          transition: "transform 0.3s, border 0.3s",
          "&:hover": {
            transform: "translateY(-2px)"
          }
        }}
      >
        <CardContent className="product-card-content">
          <div className="restaurant-img-wrapper">
            <CardMedia height="200">
              <Skeleton variant="rectangular" width={250} height={170} />
            </CardMedia>
          </div>
          <Typography variant="h6" component="h6" className="bold" color="#000">
            <Skeleton />
          </Typography>
          <CardActions sx={{ padding: "0", marginBottom: "10px" }}>
            <Typography
              variant="subtitle1"
              component="h6"
              sx={{ flexGrow: 1 }}
              color="#000"
            >
              <Skeleton height={10} />
              <Skeleton height={10} />
              <Skeleton height={10} />
            </Typography>
          </CardActions>
          <div className="border" />
          <CardActions sx={{ padding: "0" }}>
            <Typography
              variant="subtitle1"
              component="h6"
              color="#838383"
              sx={{ flexGrow: 1 }}
            >
              <Skeleton width={60} />
            </Typography>
          </CardActions>
        </CardContent>
      </Card>
    </span>
  ));
};

export default ResPlaceholder;
