import { Typography } from "@mui/material";
import React from "react";

function Nofound(props) {
  return (
    <div className="not-found">
      <img
        src={process.env.PUBLIC_URL + "/images/not-found.gif"}
        alt="notfound"
      />
      <Typography variant="h6" component="h5">
        Nothing here yet!
      </Typography>
    </div>
  );
}

export default Nofound;
