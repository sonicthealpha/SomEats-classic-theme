import { Grid, Card, Typography, Box } from "@mui/material";
import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import Add from "../components/address/Add";
import Edit from "../components/address/Edit";
import { useAddress } from "../context/AddressContext";
import Delete from "../components/address/Delete";

const UserAddress = () => {
  const { addresses } = useAddress();
  return (
    <>
      <Grid container spacing={2}>
        {addresses &&
          addresses.map((adds, index) => {
            const {
              address,
              id,
              landmark,
              city,
              mobile,
              area,
              latitude,
              longitude,
              type,
            } = adds;

            return (
              <Grid item md={6} key={index}>
                <Card
                  variant="outlined"
                  sx={
                    {
                     height: "auto",
                    }
                  }
                >
                  <Grid container spacing={2}>
                    <div className="location-wrapper">
                      <Grid item md={2}>
                        <LocationOnIcon className="service-svg" />
                      </Grid>
                      <Grid item md={10} className="service-desc" mb={4}>
                        <Typography
                          variant="h6"
                          component="h5"
                          sx={{
                            color: "rgb(79, 79, 79)",
                            textTransform: "capitalize",
                          }}
                        >
                          {type}
                        </Typography>
                        {/* Use the Box component to wrap the address with overflow-wrap set to break-word */}
                        <Box
                          component="div"
                          sx={{ overflowWrap: "break-word" }}
                        >
                          <Typography
                            variant="subtitle1"
                            component="h5"
                            sx={{ whiteSpace: "pre-wrap" }}
                          >
                            {address}
                          </Typography>
                        </Box>
                        <Box
                          component="div"
                          sx={{ overflowWrap: "break-word" }}
                        >
                          <Typography
                            variant="subtitle1"
                            component="h5"
                            sx={{ whiteSpace: "pre-wrap" }}
                          >
                            {landmark}
                          </Typography>
                        </Box>
                        <div className="action-btn">
                          <Edit
                            id={id}
                            address={address}
                            user_landmark={
                              landmark !== undefined || landmark !== "undefined"
                                ? landmark
                                : ""
                            }
                            user_city={city}
                            user_area={area}
                            user_mobile={mobile}
                            longitude={longitude}
                            latitude={latitude}
                            type={type}
                          />
                          <Delete id={id} />
                        </div>
                      </Grid>
                    </div>
                  </Grid>
                </Card>
              </Grid>
            );
          })}
        <Grid item md={6}>
          <Add />
        </Grid>
      </Grid>
    </>
  );
};

export default UserAddress;
