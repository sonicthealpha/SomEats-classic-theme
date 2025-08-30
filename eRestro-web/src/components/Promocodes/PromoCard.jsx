import React, { useState } from "react";
import { Box, Grid, Typography, Button, CardMedia } from "@mui/material";
import { t } from "i18next";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const PromoCard = ({ promoCode, currency, onApplyPromoCode }) => {
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const handleApplyPromoCode = async () => {
    try {
      const response = await onApplyPromoCode(promoCode);

      if (!response.error) {
        setIsPromoApplied(true);
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
    }
  };

  return (
    <Grid
      container
      bgcolor="var(--promo-bgColor--)"
      height={"212px"}
      width={"auto"}
      borderRadius={"10px"}
      padding={2}
      marginBottom={4}
    >
      <Grid
        item
        xs={8}
        sx={{
          borderRight: "3px dotted #fff",
          paddingRight: "16px",
          paddingY: "-16px !important",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3} ml={-1}>
            <CardMedia
              component="img"
              alt="Promo Image"
              image={promoCode?.image}
              sx={{ borderRadius: "50%", height: "80px", width: "80px" }}
            />
          </Grid>
          <Grid item xs={9}>
            <Typography
              component="h1"
              sx={{
                marginLeft: "16px",
                display: "flex",
                alignItems: "center",
                height: "30px",
                wordWrap: "break-word",
                whiteSpace: "normal",
                fontWeight: "bold",
              }}
            >
              {promoCode?.promo_code}
            </Typography>
            <Typography
              sx={{
                marginLeft: "16px",
                display: "flex",
                alignItems: "center",
                wordWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {promoCode?.message}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: "0.90rem" }}>
              {t("minimum_order_value")}:{" "}
              <Typography
                component={"span"}
                sx={{ color: "green", fontWeight: "bold" }}
              >
                {promoCode?.min_order_amt}
              </Typography>
              <Typography
                component={"span"}
                sx={{ color: "green", fontWeight: "bold" }}
              >
                {currency}
              </Typography>
            </Typography>
            <Typography sx={{ fontSize: "0.90rem" }}>
              {t("maximum_discount")}:{" "}
              <Typography
                component={"span"}
                sx={{ color: "green", fontWeight: "bold" }}
              >
                {promoCode?.max_discount_amt}
              </Typography>
              <Typography
                component={"span"}
                sx={{ color: "green", fontWeight: "bold" }}
              >
                {currency}
              </Typography>
            </Typography>
            <Typography sx={{ fontSize: "0.90rem" }}>
              {t("offer_starts_from")}:{" "}
              <Typography component={"span"} sx={{ fontWeight: "bold" }}>
                {" "}
                {promoCode?.start_date}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "0.90rem",
              }}
            >
              <ReportProblemIcon sx={{ fontSize: "medium" }} />{" "}
              <Typography
                component={"span"}
                sx={{ color: "red", fontWeight: "bold" }}
              >
                {promoCode?.remaining_days}*
              </Typography>{" "}
              {t("days__remaining_hurry_up")}!
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        xs={0.5}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Box
          width={"50px"}
          height={"25px"}
          bgcolor={"white"}
          sx={{
            borderRadius: "0 0 25px 25px",
            transform: "translate(-50%, -65%)",
          }}
        />
        <Box
          width={"50px"}
          height={"25px"}
          bgcolor={"white"}
          sx={{
            borderRadius: "25px 25px 0 0",
            transform: "translate(-50%, 65%)",
          }}
        />
      </Grid>
      <Grid
        item
        xs={3.5}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"} // Display items in a column
      >
        <Typography
          marginBottom={1}
          sx={{ fontWeight: 600, fontSize: "2.25rem" }}
        >
          {promoCode?.discount}
          {promoCode?.discount_type === "amount" ? currency : "%"}
        </Typography>

        <Button
          variant="outlined"
          onClick={handleApplyPromoCode}
          disabled={isPromoApplied}
          sx={{
            width: "80%",
            borderColor: "#dd4a48",
            textTransform: "none",
            color: "#dd4a48",

            backgroundColor: "--tab-bgColor--",
            "&:hover": {
              borderColor: "#dd4a48",
            },
            "&.Mui-focusVisible": {
              borderColor: "#dd4a48",
            },
          }}
        >
          {isPromoApplied ? t("applied") : t("apply")}
        </Button>
      </Grid>
    </Grid>
  );
};

export default PromoCard;
