import {
  Box,
  Button,
  Modal,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import { useAddress } from "../../context/AddressContext";
import * as api from "../../utils/api";
import { toast } from "react-hot-toast";
import { t } from "i18next";

const Edit = ({
  id,
  address,
  user_mobile,
  user_landmark,
  user_city,
  user_area,
  latitude,
  longitude,
  type,
}) => {
  const [Editopen, setEditOpen] = useState(false); // eslint-disable-next-line
  const [addressType, setAddressType] = useState();
  const [alignment, setAlignment] = useState(type);

  const handleAlignment = (event, newAlignment) => {
    if (newAlignment != null) {
      setAlignment(newAlignment);
    }
  };
  const { addresses, EditAddress, onMarkerDragEnd, setUser, userAddress } =
    useAddress();
  const [user, setUserNew] = useState({
    mobile: user_mobile,
    userAddress: address,
    area: user_area,
    landmark: user_landmark,
    city: user_city,
  });

  const EditModalOpen = () => {
    setEditOpen(true);
  };
  const EditModalClose = () => setEditOpen(false);

  const [newLatitude, setLatitude] = useState(
    latitude !== "null" ? parseFloat(latitude) : parseFloat(23.239403749861083)
  );
  const [newLongitude, setLongitude] = useState(
    longitude !== "null" ? parseFloat(longitude) : parseFloat(69.66091375390621)
  );

  const onInputChange = (e) => {
    // console.log(e);
    const field_name = e.target.name;
    const field_value = e.target.value;
    setUserNew((user) => ({ ...user, [field_name]: field_value }));
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const EditData = (e) => {
    e.preventDefault();
    const address_value = e.target.userAddress;
    const city_data = e.target.city;
    const area_data = e.target.area;
    const mobile_data = e.target.mobile;
    const landmark_data = e.target.landmark;

    const user_address = address_value.value;
    const user_city = city_data.value;
    const user_area = area_data.value;
    const user_mobile = mobile_data.value;
    const user_landmark = landmark_data.value;

    api
      .update_address(
        id,
        user_mobile,
        user_address,
        user_area,
        user_city,
        user_landmark
      )
      .then((response) => {
        console.log(response);
        if (response.error === true) {
          toast.error(response.message);
        } else {
          toast.success("Address Updates Successfully", {
            onClose: refreshPage, // Refresh when the toast is closed
          });
          setTimeout(refreshPage, 5000);
        }
      });

    // EditAddress(
    //   id,
    //   user_mobile,
    //   user_address,
    //   user_area,
    //   user_city,
    //   user_landmark
    // );
    EditModalClose(true);
  };

  const lati = parseFloat(newLatitude);
  const long = parseFloat(newLongitude);

  const center = {
    lat: lati,
    lng: long,
  };

  const handleInput = (e) => {
    setAddressType(e.target.value);
  };

  const extractAddress = (place) => {
    const address = {
      city: "",
      state: "",
      zip: "",
      country: "",
      plain() {
        const city_data = this.city ? this.city + ", " : "";
        const zip = this.zip ? this.zip + ", " : "";
        const state = this.state ? this.state + ", " : "";
        return city_data + zip + state + this.country;
      },
    };
    console.log(place);

    if (!Array.isArray(place?.address_components)) {
      return address;
    }

    place.address_components.forEach((component) => {
      const types = component.types;
      const long_value = component.long_name;

      if (types.includes("locality")) {
        address.city = long_value;
      }

      if (types.includes("administrative_area_level_2")) {
        address.state = long_value;
      }

      if (types.includes("postal_code")) {
        address.zip = long_value;
      }

      if (types.includes("country")) {
        address.country = long_value;
      }
    });
    return address;
  };

  const movePoint = (e) => {
    let geocoder = new window.google.maps.Geocoder();
    geocoder
      .geocode({
        latLng: e.latLng,
      })
      .then((res) => {
        const extract_city = extractAddress(res.results[0]);
        console.log(extract_city);
        const addresses = res.results[0].formatted_address,
          addarea = res.results[0].address_components[1].long_name,
          addcity = extract_city.city;
        setLatitude(e.latLng.lat());
        setLongitude(e.latLng.lng());

        console.log(addresses);

        setUserNew({
          userAddress: addresses ? addresses : "",
          city: addcity ? addcity : "",
          area: addarea ? addarea : "",
        });
        console.log(user);
      });
  };

  return (
    <>
      <Button sx={{ mt: "10px" }} variant="text" onClick={EditModalOpen}>
        {t("edit")}
      </Button>
      <Modal
        open={Editopen}
        onClose={EditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="map-modal"
          sx={{
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#E6E1E0",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#454545",
              borderRadius: "5px",
            },
            "&": {
              scrollbarWidth: "thin",
              scrollbarColor: "#312C2B",
            },
            pt: { md: 1, sm: 1, "!important": true }, // Apply padding-top only for md screen size with !important
            position: "relative",

            // Adjust padding as needed
          }}
        >
          <IconButton
            sx={{
              position: "sticky",
              top: "4px",
              ml: { xs: 36, sm: 68, md: 70 }, // Adjust margin left for different screen sizes
              right: 0,
              zIndex: 99999,
            }}
            onClick={EditModalClose}
          >
            <CloseIcon />
          </IconButton>

          <div className="map-wrapper">
            <Typography
              variant="h5"
              component="h5"
              className="mb20"
              sx={{
                mt: {
                  xs: 0, // For extra small screens and above
                  md: 0, // For medium screens and above
                },
                mb: 0.1, // Margin-bottom remains constant
              }}
            >
              {t("set_your_location")}
            </Typography>

            <form onSubmit={EditData}>
              <Box
                sx={{
                  ml: {
                    xs: 0.1, // For extra small screens and above
                    sm: -1, // For medium screens and above
                    md: -1,
                  },
                }}
              >
                <GoogleMap id="google-map" center={center} zoom={10}>
                  <Marker
                    position={center}
                    draggable={true}
                    onDragEnd={movePoint}
                  >
                    <InfoWindow position={center}>
                      <div>
                        <p>{address}</p>
                      </div>
                    </InfoWindow>
                  </Marker>
                </GoogleMap>
              </Box>

              <Box
                sx={{
                  mx: {
                    xs: 0, // For extra small screens and above
                    sm: -0.2,
                    md: -1.5, // For medium screens and above
                  },
                  ml: {
                    xs: 0.1, // For extra small screens and above
                    sm: -1, // For medium screens and above
                    md: -1,
                  },
                }}
              >
                <TextField
                  fullWidth
                  label={t("userAddress")}
                  id="userAddress"
                  className="mb20 mt20"
                  name="userAddress"
                  value={user.userAddress}
                  onChange={onInputChange}
                />
                <TextField
                  fullWidth
                  label={t("city")}
                  id="city"
                  name="city"
                  className="mb20 mt20"
                  value={user.city}
                  onChange={onInputChange}
                />
                <TextField
                  fullWidth
                  label={t("area")}
                  id="area"
                  name="area"
                  className="mb20 mt20"
                  value={user.area}
                  onChange={onInputChange}
                />
                <TextField
                  fullWidth
                  label={t("mobile")}
                  id="mobile"
                  className="mb20 mt20"
                  name="mobile"
                  value={user.mobile}
                  onChange={onInputChange}
                />
                <TextField
                  fullWidth
                  label={t("landmark")}
                  value={user.landmark}
                  name="landmark"
                  className="mb20 mt20"
                  onChange={onInputChange}
                />

                <div className="btn-grp mt20">
                  <ToggleButtonGroup
                    value={alignment}
                    color="error"
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                    sx={{ minWidth: "210px" }} // Setting the minimum width for the entire group
                  >
                    <ToggleButton
                      value="home"
                      aria-label="home"
                      onClick={(e) => handleInput(e)}
                      sx={{ minWidth: "70px" }} // Setting the minimum width for each button
                    >
                      {t("home")}
                    </ToggleButton>
                    <ToggleButton
                      value="office"
                      aria-label="office"
                      onClick={(e) => handleInput(e)}
                      sx={{ minWidth: "70px" }} // Setting the minimum width for each button
                    >
                      {t("office")}
                    </ToggleButton>
                    <ToggleButton
                      value="other"
                      aria-label="other"
                      onClick={(e) => handleInput(e)}
                      sx={{ minWidth: "70px" }} // Setting the minimum width for each button
                    >
                      {t("other")}
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
                  {t("update")}
                </Button>
              </Box>
            </form>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Edit;
