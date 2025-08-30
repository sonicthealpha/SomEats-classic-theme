import {
  Button,
  Card,
  Modal,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Box } from "@mui/system";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAddress } from "../../context/AddressContext";
import { useTranslation } from "react-i18next";

const center = {
  lat:
    localStorage.getItem("latitude") != null
      ? parseFloat(localStorage.getItem("latitude"))
      : 23.2539,
  lng:
    localStorage.getItem("longitude") != null
      ? parseFloat(localStorage.getItem("longitude"))
      : 69.6693,
};

function Add({ addresses }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [addressType, setAddressType] = useState();
  const [alignment, setAlignment] = React.useState("home");

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment != null) {
      setAlignment(newAlignment);
    }
  };
  const {
    add_address,
    onMarkerDragEnd,
    setUser,
    city,
    landmark,
    area,
    mobile,
    userAddress,
  } = useAddress();

  const onInputChange = (e) => {
    console.log(e);
    const field_name = e.target.name;
    const field_value = e.target.value;
    setUser((user) => ({ ...user, [field_name]: field_value }));
  };

  //   add address

  const onSubmit = (e) => {
    e.preventDefault();
    handleClose(true);
    setUser("");
    add_address(addressType);
  };

  const handleInput = (e) => {
    setAddressType(e.target.value);
  };

  return (
    <>
      <Card
        variant="outlined"
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          height: 200,
          padding: "50px",
          textAlign: "center",
        }}
      >
        <div>
          <AddCircleOutlineIcon className="service-svg" />
          <Typography variant="h6" component="h5" className="bold">
            {t("add_address")}
          </Typography>
        </div>
      </Card>

      {/* add modal */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="map-modal">
          <div className="map-wrapper">
            <Typography variant="h5" component="h5" className="mb20">
              Set Your Location
            </Typography>

            <form onSubmit={(e) => onSubmit(e)}>
              <GoogleMap id="google-map" center={center} zoom={10}>
                <Marker
                  position={center}
                  draggable={true}
                  onDragEnd={onMarkerDragEnd}
                >
                  <InfoWindow position={center}>
                    <div>{addresses}</div>
                  </InfoWindow>
                </Marker>
              </GoogleMap>

              <TextField
                fullWidth
                label="Address"
                id="fullWidth "
                className="mb20 mt20"
                name="userAddress"
                value={userAddress}
                onChange={(e) => {
                  onInputChange(e);
                }}
              />
              <TextField
                fullWidth
                label="City"
                id="fullWidth "
                className="mb20 mt20"
                name="city"
                value={city}
                onChange={(e) => {
                  onInputChange(e);
                }}
              />

              <TextField
                fullWidth
                label="Area"
                id="fullWidth "
                name="area"
                value={area}
                className="mb20 mt20"
                onChange={(e) => {
                  onInputChange(e);
                }}
              />
              <TextField
                fullWidth
                label="Mobile No"
                id="fullWidth "
                className="mb20 mt20"
                name="mobile"
                value={mobile}
                onChange={(e) => {
                  onInputChange(e);
                }}
              />
              <TextField
                fullWidth
                label="landmark"
                id="fullWidth "
                name="landmark"
                value={landmark}
                className="mb20 mt20"
                onChange={(e) => {
                  onInputChange(e);
                }}
              />
              <div className="btn-grp mt20">
                <Typography>Tag This Location For Later</Typography>
                <ToggleButtonGroup
                  value={alignment}
                  color="error"
                  exclusive
                  onChange={handleAlignment}
                  aria-label="text alignment"
                >
                  <ToggleButton
                    value="home"
                    aria-label="home"
                    onClick={(e) => handleInput(e)}
                  >
                    Home
                  </ToggleButton>
                  <ToggleButton
                    value="office"
                    aria-label="office"
                    onClick={(e) => handleInput(e)}
                  >
                    Office
                  </ToggleButton>
                  <ToggleButton
                    value="other"
                    aria-label="other"
                    onClick={(e) => handleInput(e)}
                  >
                    Other
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <Button
                fullWidth
                variant="outlined"
                type="submit"
                color="error"
                sx={{ marginTop: "20px" }}
              >
                {t("add_new_address")}
              </Button>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default Add;
