import {
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Typography
} from "@mui/material";
import React from "react";
import CardCover from "@mui/joy/CardCover";

const ProductCardPlaceHolder = () => {
  return (
    <div className="category-wrapper">
      <Card sx={{ boxShadow: "none" }}>
        <CardCover className="radius" />
        <CardMedia height="340">
          <Skeleton variant="rectangular" width={390} height={300} />
        </CardMedia>
        <CardContent className="category-content" sx={{ width: "100%" }}>
          <Typography
            gutterBottom
            variant="h5"
            component="h5"
            color="#fff"
            className="bold"
          >
            <Skeleton height={20} />
            <Skeleton height={10} />
            <Skeleton height={10} />
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCardPlaceHolder;
