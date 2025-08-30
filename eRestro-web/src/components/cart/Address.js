import { Grid, Card, Typography, Button, Box } from "@mui/material";
import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Add from "../address/Add";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { t } from "i18next";

const Address = ({ addresses, setSelectedAddress, SelectedAddress, count }) => {
  // eslint-disable-next-line
  const [selectAddress, setAddress] = useState();
  const [selectArea, setArea] = useState();
  const Address = (id, area, address_data) => {
    setArea(area);
    setAddress(address_data);
    localStorage.setItem("address", address_data);
    setSelectedAddress(id);
    count(1);
  };

  console.log("address");

  const user_address = localStorage.getItem("address");

  return (
    <>
      {SelectedAddress ? (
        <>
          <Card variant="outlined">
            <Box className="selectedaddress-wrapper" sx={{ padding: "20px" }}>
              <div className="address-tite mb20">
                <Typography variant="h6" component="h5" className="bold">
                  Delivery Address
                  <CheckCircleIcon
                    color="error"
                    sx={{ verticalAlign: "middle", marginLeft: "20px" }}
                  />
                </Typography>
              </div>
              <Typography variant="body1" component="h5" className="bold">
                {user_address}
              </Typography>
              <Typography
                variant="body2"
                component="h6"
                color="#8d8686"
                sx={{ mt: "10px" }}
              >
                {selectArea}
              </Typography>
            </Box>
          </Card>
        </>
      ) : (
        <>
          <Grid container spacing={2}>
            {addresses.map((adds, index) => {
              const { address, area, id, type } = adds;
              return (
                <Grid item md={6} key={index}>
                  <Card
                    variant="outlined"
                    sx={{ height: 210, position: "relative" }}
                  >
                    <Box className="location-wrapper" sx={{ height: "auto" }}>
                      <Grid container>
                        <Grid item md={2}>
                          <LocationOnIcon className="service-svg" />
                        </Grid>
                        <Grid item md={10}>
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
                          <Typography variant="subtitle1" component="h5">
                            {address}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Button
                      variant="contained"
                      color="error"
                      id={id}
                      sx={{
                        textTransform: "capitalize",
                        marginLeft: "50px",
                        position: "absolute",
                        bottom: "1rem",
                      }}
                      onClick={(e) => Address(id, area, address)}
                    >
                      {t("delivery_here")}
                    </Button>
                  </Card>
                </Grid>
              );
            })}
            <Grid item md={6}>
              <Add />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Address;
