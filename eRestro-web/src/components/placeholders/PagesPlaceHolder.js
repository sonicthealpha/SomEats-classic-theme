import { Box, Skeleton, Typography } from "@mui/material";
import React from "react";

const PagesPlaceHolder = () => {
  return (
    <Box>
      <div>
        <div className="title-wrapper">
          <Typography variant="h4" component="h4" className="bold">
            <Skeleton variant="text" width="20%" />
          </Typography>
        </div>
        <Typography variant="h3" sx={{ fontWeight: "bold" }} component="div">
          <Skeleton variant="text" width="20%" />
        </Typography>

        <Typography variant="body1" sx={{ marginTop: "20px" }} component="div">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "bold" }} component="div">
          <Skeleton variant="text" width="20%" />
        </Typography>

        <Typography variant="body1" sx={{ marginTop: "20px" }} component="div">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "bold" }} component="div">
          <Skeleton variant="text" width="20%" />
        </Typography>

        <Typography variant="body1" sx={{ marginTop: "20px" }} component="div">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "bold" }} component="div">
          <Skeleton variant="text" width="20%" />
        </Typography>

        <Typography variant="body1" sx={{ marginTop: "20px" }} component="div">
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </Typography>
      </div>
    </Box>
  );
};

export default PagesPlaceHolder;
