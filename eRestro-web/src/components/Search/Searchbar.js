import React, { useEffect, useRef, useState, useCallback } from "react";
import config from "../../utils/config";
import { Box, Divider, IconButton, InputBase, Paper } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-hot-toast";
import * as api from "../../utils/api";
import StarRateIcon from "@mui/icons-material/StarRate";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { initMapScript, extractAddress, lat_long } from "../../utils/functions";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";

const apiKey = config.YOUR_GOOGLE_MAPS_API_KEY;

const Searchbar = () => {
  const searchInput = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [show, setSate] = useState(false);
  const ref = useRef();
  const formRef = useRef(null); // Add a ref to the form element
  const width = "100%";

  const [filteredData, setFilteredData] = useState([]);

  const {
    setLoading,
    city_deliverable,
    get_restaurants,
    get_products,
    get_categories,
  } = useSearch();
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback(
    debounce(async (e) => {
      const value = e.target.value.trim();
      setSearchValue(value);

      if (value === "") {
        setFilteredData([]);
        return;
      }

      try {
        const city_id = localStorage.getItem("city");
        const response = await api.get_products(
          "",
          "",
          "",
          value,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          city_id,
          ""
        );
        if (response.error) {
          setFilteredData([]);
        } else {
          setFilteredData(response.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }, 500),
    []
  );

  useEffect(() => {
    const initAutocomplete = () => {
      if (window.google && window.google.maps && searchInput.current) {
        const autoComplete = new window.google.maps.places.Autocomplete(
          searchInput.current
        );
        autoComplete.setFields(["address_component", "geometry"]);
        autoComplete.addListener("place_changed", () =>
          onChangeAddress(autoComplete)
        );
        setAutocomplete(autoComplete);
      }
    };

    initMapScript().then(initAutocomplete);
  }, []);

  const onChangeAddress = (autoComplete) => {
    const place = autoComplete.getPlace();
    if (!place || !place.geometry || !place.geometry.location) {
      console.error("Invalid place object or missing location:", place);
      return;
    }

    const { lat, lng } = place.geometry.location;
    lat_long("latitude", lat());
    lat_long("longitude", lng());

    const selected_city = extractAddress(place).city;
    setLoading(false);
    localStorage.setItem("selected_city", selected_city);
    localStorage.removeItem("current_city");

    // Clear search results after a place is selected
    setFilteredData([]);

    // Update the input field value with the selected city
    searchInput.current.value = selected_city;

    city_deliverable(selected_city).then(() => {
      const city = localStorage.getItem("city");
      get_restaurants(city);
      get_products(city);
      get_categories();
    });
  };

  const findMyLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        lat_long("latitude", latitude);
        lat_long("longitude", longitude);
        const city_id = localStorage.getItem("city");
        reverseGeocode({ latitude, longitude }, city_id);
      });
    }
  };

  const reverseGeocode = ({ latitude, longitude }, city_id) => {
    const geocodeJson = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&latlng=${latitude},${longitude}`;
    searchInput.current.value = "Getting your location...";
    fetch(geocodeJson)
      .then((response) => response.json())
      .then((location) => {
        const place = location.results[0];
        const address = extractAddress(place);
        localStorage.setItem("current_city", address.city);
        localStorage.removeItem("selected_city");
        city_deliverable(address.city).then(() => {
          get_restaurants(city_id);
          get_products(city_id);
          get_categories();
        });
        searchInput.current.value = address.plain();
      })
      .catch((error) => {
        console.error("Error while fetching location: ", error);
        searchInput.current.value = "";
        toast.error("Error fetching location");
      });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
  };

  const city_id = localStorage.getItem("city");
  const selected_city = localStorage.getItem("selected_city");
  const current_city = localStorage.getItem("current_city");

  return (
    <div className="desktop-search-bar">
      <Paper
        ref={ref}
        component="form"
        className="searchbar-form desktop-header"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: { width },
          margin: "auto",
          flexDirection: "row", // Change to row for horizontal layout
        }}
        onSubmit={handleFormSubmit}
      >
        <div className="searchBar-sec">
          <div className="search">
            <input
              ref={searchInput}
              type="text"
              defaultValue={current_city ? current_city : selected_city}
              placeholder={t("search_location")}
            />
            <IconButton onClick={findMyLocation}>
              <MyLocationIcon className="svg-color" />
            </IconButton>
          </div>
        </div>

        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>

        <Box className="input_dropdown" sx={{ minWidth: "330px !important" }}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={t("search_bar_text")}
            inputProps={{ "aria-label": "search google maps" }}
            onChange={handleSearch}
            onClick={() => setSate(!show)}
          />

          <div className="dropdown_Sec">
            {show && (
              <>
                {city_id != null ? (
                  <>
                    {filteredData.length > 0 ? (
                      filteredData.map((value, index) => (
                        <div className={`dropdown_data`} key={index}>
                          {value.partner_details.map(
                            (partner_details, index) => (
                              <Link
                                key={index}
                                to={`/restaurant/${partner_details.slug}`}
                              >
                                <div className="list_Data">
                                  <div className="partner_image">
                                    <img
                                      className="partner_profile"
                                      src={partner_details.partner_profile}
                                      alt="logo"
                                    />
                                  </div>
                                  <div className="partner_detail">
                                    <p className="partner_name">
                                      {partner_details.partner_name}
                                    </p>
                                    <div className="rating_and_time">
                                      <p className="staricon">
                                        <StarRateIcon />
                                        {partner_details.partner_rating}
                                      </p>
                                      <p className="cooktime">
                                        <AccessTimeIcon />
                                        {partner_details.partner_cook_time}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            )
                          )}
                        </div>
                      ))
                    ) : (
                      <div className={`dropdown_data`}>
                        <h5>{t("find_your_nearest_restaurants_here")}</h5>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={`dropdown_data`}>
                    <h5>{t("sorry_no_result_found")}</h5>
                  </div>
                )}
              </>
            )}
          </div>
        </Box>
      </Paper>
    </div>
  );
};

export default Searchbar;
