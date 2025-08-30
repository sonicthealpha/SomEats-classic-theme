import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { t } from "i18next";

const ApiErrorPage = ({ onRetry }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box
        component={"img"}
        src={"/images/no-food-truck.svg"}
        alt="No Food"
        sx={{ maxWidth: "100vh", maxHeight: "50vh" }}
      />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            fontFamily: "Plus Jakarta Sans",
            fontWeight: "bold",
            fontSize: "32px",
            lineHeight: "32px",
            letterSpacing: "0px",
            marginTop: "-28px",
          }}
        >
          {t("something_went_wrong")}
        </Typography>{" "}
        <Button
          sx={{
            marginTop: 3,
            backgroundColor: "#dd4a48",
            "&:hover": {
              backgroundColor: "var(--primary-color--)", // Set hover background color same as default color
            },
          }}
          variant="contained"
          onClick={onRetry}
        >
          {t("retry")}
        </Button>
      </Box>
    </Box>
  );
};

export default ApiErrorPage;
