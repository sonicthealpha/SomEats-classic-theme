import React, { useEffect, useRef, useState, useCallback } from "react";
import config from "../../utils/config";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  useMediaQuery,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-hot-toast";
import * as api from "../../utils/api";
import StarRateIcon from "@mui/icons-material/StarRate";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { extractAddress, lat_long } from "../../utils/functions";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import { LocationOnOutlined } from "@mui/icons-material";
import useOutsideClick from "./useOutsideClick";

const apiKey = config.YOUR_GOOGLE_MAPS_API_KEY;

const SearchBarNew = () => {
  // Refs
  const searchInput = useRef(null);
  const locationDropdownRef = useRef(null);
  const formRef = useRef(null);
  const ref = useRef();

  // Media queries
  const isMobile = useMediaQuery("(max-width:768px)");
  const isMediumScreen = useMediaQuery("(max-width:1024px)");

  // State
  const [show, setSate] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  // Add state for keyboard navigation
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Get width based on screen size
  const width = isMobile ? "100%" : isMediumScreen ? "465px" : "550px";

  // Context and translations
  const {
    setLoading,
    city_deliverable,
    get_restaurants,
    get_products,
    get_categories,
  } = useSearch();
  const { t } = useTranslation();

  // Outside click handlers
  useOutsideClick(ref, () => {
    if (show) setSate(false);
  });

  useOutsideClick(locationDropdownRef, () => {
    if (showLocationSuggestions) setShowLocationSuggestions(false);
  });

  // Debounced search function
  const handleSearch = useCallback(
    debounce(async (value) => {
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

  // Handle product search input
  const handleProductSearch = (e) => {
    const value = e.target.value.trim();
    handleSearch(value);
  };

  // Initialize Google Maps session token
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const token = new window.google.maps.places.AutocompleteSessionToken();
      setSessionToken(token);
    }
  }, []);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google Maps API loaded successfully");
          const token =
            new window.google.maps.places.AutocompleteSessionToken();
          setSessionToken(token);
        };
        document.body.appendChild(script);
      }
    };

    loadGoogleMapsScript();
  }, []);

  // Find user's current location
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

  // Handle location search input
  const handleLocationSearch = async (e) => {
    const value = e.target.value;

    if (value.trim() === "") {
      setPlaceSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    setShowLocationSuggestions(true);
    // Reset selected index when new search is performed
    setSelectedSuggestionIndex(-1);

    if (
      window.google &&
      window.google.maps &&
      window.google.maps.places &&
      sessionToken
    ) {
      try {
        const request = {
          input: value,
          sessionToken: sessionToken,
          origin: {
            lat: Number(process.env.REACT_APP_DEMO_LATITUDE) || 23.2419997,
            lng: Number(process.env.REACT_APP_DEMO_LONGITUDE) || 69.6669324,
          },
          region: process.env.REACT_APP_COUNTRY_CODE || "in",
        };

        const { suggestions } =
          await window.google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            request
          );

        if (suggestions && suggestions.length > 0) {
          setPlaceSuggestions(suggestions);
        } else {
          setPlaceSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching place suggestions:", error);
        setPlaceSuggestions([]);
      }
    }
  };

  // Handle place selection from suggestions
  const handlePlaceSelect = async (suggestion) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      try {
        const place = suggestion.placePrediction.toPlace();

        await place.fetchFields({
          fields: ["displayName", "formattedAddress", "location"],
        });

        const latitude = place.location.lat();
        const longitude = place.location.lng();

        if (searchInput.current) {
          searchInput.current.value = place.formattedAddress;
        }

        lat_long("latitude", latitude);
        lat_long("longitude", longitude);

        localStorage.setItem("current_city", place.displayName);
        localStorage.removeItem("selected_city");
        city_deliverable(place.displayName).then((response) => {
          let { city_id = undefined } = response;
          if (city_id) {
            get_restaurants(city_id);
            get_products(city_id);
            get_categories();
            localStorage.setItem("city", city_id);
            localStorage.setItem("selected_city", place.displayName);
          } else {
            get_restaurants(0);
            get_products(0);
            get_categories();
            localStorage.removeItem("city");
            toast.error(response?.message);
          }
        });

        setPlaceSuggestions([]);
        setShowLocationSuggestions(false);
        setSelectedSuggestionIndex(-1);

        const token = new window.google.maps.places.AutocompleteSessionToken();
        setSessionToken(token);
      } catch (error) {
        console.error("Error fetching place details:", error);
        toast.error("Error fetching location details");
      }
    }
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async ({ latitude, longitude }) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
      searchInput.current.value = "Getting your location...";
      const res = await fetch(url, {
        headers: {
          "User-Agent": "eRestro/1.0",
          "Accept-Language": "en",
        },
      });
      const data = await res.json();

      const address = data.address;
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        address.county;

      localStorage.setItem("current_city", city);
      localStorage.removeItem("selected_city");

      const response = await city_deliverable(city);
      const city_id = localStorage.getItem("city");

      if (response?.city_id != null) {
        get_restaurants(city_id);
        get_products(city_id);
        get_categories();
      } else {
        get_restaurants(0);
        get_products(0);
        get_categories();
        localStorage.removeItem("city");
        toast.error(response?.message);
      }

      searchInput.current.value = city;
    } catch (err) {
      console.error("Error while fetching location: ", err);
      toast.error("Error fetching location");
      searchInput.current.value = "";
    }
  };

  // Prevent form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    if (!showLocationSuggestions || placeSuggestions.length === 0) return;

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex < placeSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : placeSuggestions.length - 1
      );
    }
    // Enter key
    else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handlePlaceSelect(placeSuggestions[selectedSuggestionIndex]);
    }
    // Escape key
    else if (e.key === "Escape") {
      setShowLocationSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const city_id = localStorage.getItem("city");
  const selected_city = localStorage.getItem("selected_city");
  const current_city = localStorage.getItem("current_city");

  // Location search bar for both mobile and desktop
  const renderLocationSearchBar = () => (
    <Paper
      ref={ref}
      component="form"
      className={`searchbar-form ${isMobile ? "" : "desktop-header"}`}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: width,
        margin: "auto",
        flexDirection: isMobile ? "column" : "row",
        mb: isMobile ? 2 : 0,
      }}
      onSubmit={handleFormSubmit}
    >
      <div className="searchBar-sec" ref={locationDropdownRef}>
        <div>
          <div className="search">
            <input
              ref={searchInput}
              type="text"
              defaultValue={current_city ? current_city : selected_city}
              placeholder={t("search_location")}
              onChange={handleLocationSearch}
              onClick={() => setShowLocationSuggestions(true)}
              onKeyDown={handleKeyDown}
            />
            <IconButton onClick={findMyLocation}>
              <MyLocationIcon className="svg-color" />
            </IconButton>

            {/* Location suggestions dropdown */}
            {showLocationSuggestions && placeSuggestions.length > 0 && (
              <Box
                className="location-dropdown-container"
                sx={{
                  position: "absolute",
                  zIndex: 1000,
                  background: "white",
                  width: "100%",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                  maxHeight: "250px",
                  overflowY: "auto",
                }}
              >
                {placeSuggestions.map((suggestion, index) => (
                  <Box
                    key={`place-${index}`}
                    sx={{
                      padding: "6px 8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                      backgroundColor:
                        selectedSuggestionIndex === index ? "#e6f7ff" : "white",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => handlePlaceSelect(suggestion)}
                  >
                    <LocationOnOutlined
                      sx={{ fontSize: 18, color: "#888", mr: 1 }}
                    />
                    <Box
                      sx={{
                        fontSize: "0.875rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {suggestion.placePrediction.text.text}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </div>
        </div>
      </div>

      {/* Only show the divider and search field in desktop view */}
      {!isMobile && (
        <>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <div className="input_dropdown">
            <InputBase
              sx={{ flex: 1 }}
              placeholder={t("search_bar_text")}
              inputProps={{ "aria-label": "search" }}
              onChange={handleProductSearch}
              onClick={() => setSate(!show)}
            />

            {renderDropdown()}
          </div>
        </>
      )}
    </Paper>
  );

  // Product search bar (for mobile only)
  const renderProductSearchBar = () => {
    if (!isMobile) return null;

    return (
      <Paper
        ref={formRef}
        component="form"
        className="searchbar-form mt20"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: width,
          margin: "auto",
          padding: "10px",
          backgroundColor: "#fff",
        }}
        onSubmit={handleFormSubmit}
      >
        <div className="input_dropdown">
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={t("search_bar_text")}
            inputProps={{ "aria-label": "search" }}
            onChange={handleProductSearch}
            onClick={() => setSate(!show)}
          />

          {renderDropdown()}
        </div>
      </Paper>
    );
  };

  // Search results dropdown
  const renderDropdown = () => (
    <div className="dropdown_Sec">
      {show && (
        <>
          {city_id != null ? (
            <>
              {filteredData.length > 0 ? (
                filteredData.map((value, index) => (
                  <div className={`dropdown_data`} key={index}>
                    {value.partner_details.map((partner_details, index) => (
                      <Box
                        component={Link}
                        to={`/restaurant/${partner_details.slug}`}
                        sx={{ width: "100%" }}
                        key={index}
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
                      </Box>
                    ))}
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
  );

  return (
    <div className={isMobile ? "mobile-header" : "desktop-search-bar"}>
      {renderLocationSearchBar()}
      {renderProductSearchBar()}
    </div>
  );
};

export default SearchBarNew;
