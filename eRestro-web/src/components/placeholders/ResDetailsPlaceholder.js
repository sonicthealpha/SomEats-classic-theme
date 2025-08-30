import { Grid, Skeleton } from "@mui/material";
import React from "react";

const ResDetailsPlaceholder = () => {
  const n = 5;
  return [...Array(n)].map((elem, index) => (
    <Grid container spacing={2} key={index}>
      <Grid item md={3} sx={{ position: "relative" }}>
        <div className="product-list-image-wrapper">
          <Skeleton variant="rectangular" width={210} height={150} />
        </div>
      </Grid>
      <Grid item md={9}>
        <div className="peoduct-list-desc-wrapper">
          <Skeleton width="30%" />
          <div className="description mb5">
            <Skeleton height={10} />
            <Skeleton height={10} />
            <Skeleton height={10} />
            <Skeleton height={10} />
            <Skeleton height={10} />
          </div>
          <Skeleton width="10%" />
        </div>
      </Grid>
    </Grid>
  ));
};

export default ResDetailsPlaceholder;
