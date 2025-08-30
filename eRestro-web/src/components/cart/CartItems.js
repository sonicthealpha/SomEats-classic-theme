import {
  Button,
  Card,
  CardMedia,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import React, { useState } from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CartModal from "../common/CartModel";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectData } from "../../store/reducers/settings";
import { setWalletUsed } from "../../store/reducers/WalletPayment";
import { useTranslation } from "react-i18next";
import {
  Box,
  FormHelperText,
  FormLabel,
  Typography,
  Radio,
  RadioGroup,
  Checkbox,
} from "@mui/joy";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import {
  get_delivery_charges,
  get_promo_codes,
  validate_promo_code,
} from "../../utils/api";
import PromoCard from "../Promocodes/PromoCard";
import toast from "react-hot-toast";

const CartItems = ({ setDeliveryType, deliveryType, SelectedAddress }) => {
  const [tip, setTip] = useState(0);
  const [tipValue, setTipValue] = useState(0);
  const [note, setNote] = useState("");
  const [walletUsed, setIsWalletUsed] = useState(false);
  const { currentUser } = useAuth();
  const {
    RemoveCartData,
    usercart,
    tax_amount,
    cartData,
    clearCart, // eslint-disable-next-line
    get_promo_code,
  } = useCart();
  const partner_id =
    cartData?.data[0]?.product_details[0]?.partner_details[0]?.partner_id;

  const dispatch = useDispatch();

  const data = useSelector(selectData);
  const wallet = useSelector((state) => state.wallet)?.wallet[0];

  const currency = data.currency;

  const handleInput = (e) => {
    setTip(e.target.value === tip ? null : e.target.value);
  };

  const tip_amount = tip;

  const payable_amount =
    cartData && parseFloat(cartData.overall_amount) + parseFloat(tip_amount);

  let item_price =
    tip_amount != null && tip_amount !== 0
      ? payable_amount
      : cartData && cartData.overall_amount;

  const testAmount =
    tip_amount != null && tip_amount !== 0
      ? payable_amount
      : cartData && cartData.overall_amount;
  const [FinalTotal2, setFinalTotal2] = useState(item_price);
  const removePromo = () => {
    setFinalTotal2(item_price);
    setPromoApplied(false);
  };
  useEffect(() => {
    dispatch(setWalletUsed({ isUsed: false, total_amount: item_price }));
    fetchPromoCodes();
    // eslint-disable-next-line
  }, []);

  const handleWallateUsage = (e) => {
    setIsWalletUsed(e.target.checked);
    dispatch(
      setWalletUsed({
        isUsed: e.target.checked,
        total_amount:
          e.target.checked === true
            ? item_price - parseFloat(wallet.balance)
            : testAmount,
      })
    );
  };

  if (walletUsed === true) {
    item_price = item_price - parseFloat(wallet.balance);
    if (item_price < 0) {
      item_price = 0;
    }
  }

  localStorage.setItem("price", FinalTotal2);
  localStorage.setItem("tip", tip_amount);

  const handleTipInput = (e) => {
    setTipValue(e.target.value);
  };

  const handleAddTipInput = () => {
    setTip(tipValue === tip ? null : tipValue);
    setTipValue("");
  };

  const handleDelivery = (e) => {
    setDeliveryType(e.target.value);
  };

  const handleNote = (e) => {
    localStorage.setItem("note", note);
  };

  const handleRemoveTip = () => {
    // eslint-disable-next-line
    setTip(tip == tip ? null : tip);
  };

  const { t } = useTranslation();

  // PromoCode States

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState();
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState();
  const [promoFinal, SetPromoFinal] = useState();

  const fetchPromoCodes = async () => {
    try {
      // Call the API function with type, name, and email
      const data = await get_promo_codes(partner_id);
      // Set the retrieved promo codes in state
      setPromoCodes(data?.data);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    }
  };

  const validatePromoCode = async (promoCode) => {
    try {
      let promo_code = promoCode?.promo_code;
      let final_total = item_price;
      const finalPromo = await validate_promo_code(
        promo_code,
        final_total,
        partner_id
      );

      // Check if the promo code is valid
      if (!finalPromo.error) {
        SetPromoFinal(finalPromo?.data[0]);
        setPromoDiscount(finalPromo?.data[0]?.final_discount);
        setPromoApplied(true);
        // Extract final total and update the UI
        let newGrandTotal = finalPromo.data[0].final_total;
        localStorage.setItem("price", newGrandTotal);

        setFinalTotal2(newGrandTotal);
        toast.success("PromoCode Applied Successfully");
        setDrawerOpen(false);
      } else {
        setPromoApplied(false);
        toast.error(finalPromo?.message);
      }

      return finalPromo;
    } catch (error) {
      console.log("Error validating promo code:", error);
      setPromoApplied(false);
    }
  };

  const [deliveryCharges, setDeliveryCharges] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    setSelectedAddressId(SelectedAddress);
  }, [SelectedAddress]);

  // Fetch Delivery Charges
  const fetchDeliveryCharges = async () => {
    try {
      // Assuming you have a way to get the selected address ID
      // You might need to modify this based on your address selection logic
      const addressId = selectedAddressId || 0; // Default to 0 if no address selected

      const deliveryChargeResponse = await get_delivery_charges(
        addressId,
        item_price
      );

      if (!deliveryChargeResponse.error) {
        setDeliveryCharges(deliveryChargeResponse);

        // Update final total to include delivery charges
        const newFinalTotal =
          parseFloat(FinalTotal2) +
          (deliveryChargeResponse.is_free_delivery === "0"
            ? parseFloat(deliveryChargeResponse.delivery_charge)
            : 0);

        setFinalTotal2(newFinalTotal);
      }
    } catch (error) {
      console.error("Error fetching delivery charges:", error);
      toast.error("Could not fetch delivery charges");
    }
  };

  useEffect(() => {
    if (deliveryType == 0) {
      if (selectedAddressId) {
        // Fetch delivery charges when component mounts or price changes
        fetchDeliveryCharges();
      }
    } else {
      // Update final total to exclude delivery charges
      const newFinalTotal =
        parseFloat(FinalTotal2) -
        parseFloat(deliveryCharges?.delivery_charge || 0);

      setFinalTotal2(newFinalTotal);
      setDeliveryCharges(null);
    }
  }, [item_price, selectedAddressId, deliveryType]);

  return (
    <>
      <div className="cart-wrapper">
        <div className="cart-content-wrapper">
          <div className="user-wrapper">
            <div className="title">
              <Typography variant="h6" component="h5">
                {currentUser?.username}
              </Typography>
              <Typography variant="subtitle1" component="h5">
                {currentUser?.email}
              </Typography>
            </div>
          </div>
          <div className="border" />
          <div className="delivery-type">
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                defaultValue="0"
              >
                <FormControlLabel
                  value="0"
                  control={<Radio color="danger" sx={{ mr: 1 }} />}
                  label={t("delivery")}
                  onChange={(e) => handleDelivery(e)}
                />
                <FormControlLabel
                  value="1"
                  control={<Radio color="danger" sx={{ mr: 1 }} />}
                  sx={{ mt: 1 }}
                  label={t("self_pickup")}
                  onChange={(e) => handleDelivery(e)}
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="border" />
          <div className="restaurant-name">
            <div className="title">
              <Typography
                variant="subtitle1"
                component="h5"
                sx={{ fontWeight: "bold" }}
              >
                {t("order_from")}
              </Typography>
            </div>
          </div>
          {/* <div className="res-name">
              <Typography variant="subtitle1" component="h5">
                {console.log("usercart",usercart)}
                {usercart &&
                  usercart[0].product_details[0].partner_details[0].partner_name}
              </Typography>
              <Typography variant="subtitle1" component="h5">
                {usercart &&
                  usercart[0].product_details[0].partner_details[0]
                    .partner_address}
              </Typography>
            </div> */}
          <div className="border" />
          <div className="res-product-wrapper">
            {usercart &&
              usercart?.map((cart_item, index) => {
                const {
                  product_variant_id,
                  name,
                  special_price,
                  price,
                  qty,
                  product_details,
                  short_description,
                  minimum_order_quantity,
                  total_allowed_quantity,
                } = cart_item;

                let cart_price =
                  special_price > 0 && special_price < price
                    ? special_price
                    : price;

                const addons =
                  product_details !== undefined
                    ? product_details[0].variants[0].add_ons_data
                        .map((item) => item.description)
                        .join(", ")
                    : "";

                return (
                  <div key={index}>
                    <div className="cart-product">
                      <div className="product-wrapper">
                        <div className="product-grid">
                          <div className="food-status">
                            <img
                              src={process.env.PUBLIC_URL + "/images/veg.png"}
                              alt="veg"
                            />
                          </div>
                          <Typography
                            variant="body1"
                            component="h5"
                            sx={{ ml: "10px" }}
                          >
                            {name}
                          </Typography>
                        </div>
                        {addons !== "" ? (
                          <div className="addons">
                            <Typography variant="body2" sx={{ ml: "30px" }}>
                              addons : {addons}
                            </Typography>
                          </div>
                        ) : null}
                        <div className="price">
                          <Typography
                            variant="body1"
                            component="h5"
                            sx={{ ml: "30px" }}
                          >
                            <Typography
                              component={"span"}
                              sx={{ color: "green" }}
                            >
                              {currency}
                              {cart_price}
                            </Typography>{" "}
                            × {qty}
                          </Typography>
                        </div>
                      </div>
                      <div className="update-product mt20">
                        <CartModal
                          title={name}
                          short_description={short_description}
                          indicator={
                            product_details &&
                            product_details[0].partner_details[0]
                              .partner_indicator
                          }
                          rating={
                            product_details &&
                            product_details[0].partner_details[0].partner_rating
                          }
                          variants={
                            product_details && product_details[0].variants
                          }
                          minimum_order_quantity={minimum_order_quantity}
                          total_allowed_quantity={total_allowed_quantity}
                          addons={
                            product_details &&
                            product_details[0].product_add_ons
                          }
                          is_restro_open={
                            product_details &&
                            product_details[0].partner_details[0].is_restro_open
                          }
                          partner_id={
                            product_details &&
                            product_details[0].partner_details[0].partner_id
                          }
                          product_qty={qty}
                          type="edit_cart"
                        />
                        <Button
                          variant="text"
                          color="error"
                          onClick={(e) => RemoveCartData(product_variant_id)}
                        >
                          {t("remove_from_cart")}
                        </Button>
                      </div>
                    </div>
                    <div className="border" />
                  </div>
                );
              })}
          </div>
        </div>
        <div className="clear_cart">
          <Button
            variant="outlined"
            fullWidth
            color="error"
            onClick={(e) => clearCart()}
          >
            {t("clear_cart")}
          </Button>
        </div>
        <div className="border" />
        <div className="add_more_food">
          <Grid container spacing={2}>
            <Grid item md={10}>
              <Typography> {t("add_more_food")} </Typography>
            </Grid>
            <Grid item md={2}>
              <Link
                to={`/restaurant/${
                  usercart[0]?.product_details &&
                  usercart[0]?.product_details[0]?.partner_details[0].slug
                }`}
              >
                <AddCircleIcon color="error" />
              </Link>
            </Grid>
          </Grid>
        </div>
        <div className="border" />
        <div className="promo-code">
          <Grid container spacing={2}>
            {promoApplied ? (
              <>
                <Grid item md={12} textAlign="center">
                  -: {t("promocode_details")} :-
                </Grid>
                <Grid
                  item
                  md={8}
                  display="flex"
                  alignItems="start"
                  justifyContent="start"
                >
                  <Typography>{promoFinal?.promo_code}</Typography>
                </Grid>
                <Grid
                  item
                  md={4}
                  display="flex"
                  flexDirection={"column"}
                  alignItems="end"
                  justifyContent="center"
                  pr={2}
                >
                  <Typography sx={{ color: "green", marginRight: 2 }}>
                    {currency}
                    {promoDiscount}
                  </Typography>
                  <Button
                    sx={{ textTransform: "none" }}
                    color="error"
                    value="10"
                    onClick={removePromo}
                  >
                    {t("remove")}
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid
                  item
                  md={9}
                  display="flex"
                  alignItems="center"
                  justifyContent="start"
                >
                  <Typography>{t("add_coupon")}</Typography>
                </Grid>
                <Grid item md={3}>
                  <Button
                    color="error"
                    sx={{ textTransform: "capitalize" }}
                    onClick={() => setDrawerOpen(true)}
                  >
                    {t("view_all")}
                  </Button>
                </Grid>
              </>
            )}
          </Grid>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: {
                  xs: "50%",
                  md: "45%",
                  lg: "40%",
                },
              },
            }}
          >
            <Grid container spacing={2} padding={2}>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="flex-start"
                ml={-2}
              >
                <IconButton
                  onClick={() => setDrawerOpen(false)}
                  sx={{
                    color: "#333",
                  }}
                >
                  <KeyboardDoubleArrowLeftIcon sx={{ fontSize: "32px" }} />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 500, fontSize: "1.25rem " }}>
                  Promo Codes
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {promoCodes?.length > 0 ? (
                  promoCodes?.map((promoCode, index) => (
                    <PromoCard
                      key={promoCode?.id}
                      promoCode={promoCode}
                      currency={currency}
                      onApplyPromoCode={validatePromoCode}
                    />
                  ))
                ) : (
                  <Box mb={2}>
                    <CardMedia
                      component="img"
                      image={
                        process.env.PUBLIC_URL + "/images/Not_Have_Coupons.png"
                      }
                      alt="No promo codes available"
                    />
                    <Typography
                      textAlign={"center"}
                      sx={{ fontWeight: 500, fontSize: "1.25rem " }}
                    >
                      {t("not_promo_codes_available")}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Drawer>
        </div>

        <div className="border" />
        <div className="rider-tip">
          <div className="tip-header">
            <Typography component="h5" variant="body1">
              {t("support_rider")}
            </Typography>
            <Typography component="h5" variant="body2">
              {t("help_delivery_rider")}
            </Typography>
          </div>
          <div className="tip-wrapper">
            <Button color="error" value="10" onClick={(e) => handleInput(e)}>
              +10
            </Button>
            <Button color="error" value="20" onClick={(e) => handleInput(e)}>
              +20
            </Button>
            <Button color="error" value="30" onClick={(e) => handleInput(e)}>
              +30
            </Button>
            <Button color="error" value="50" onClick={(e) => handleInput(e)}>
              +50
            </Button>
          </div>
          <Box display={"flex"} alignItems={"center"} gap={2}>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <OutlinedInput
                id="outlined-adornment-weight"
                color="error"
                value={tipValue}
                onChange={handleTipInput}
                placeholder={t("help_provider_by_tipping")}
                size="small"
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
              />
            </FormControl>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleAddTipInput()}
              sx={{ textTransform: "capitalize" }}
            >
              {t("add")}
            </Button>
          </Box>

          <Box display={"flex"} alignItems={"center"} my={2} gap={2}>
            <FormControl>
              <FormLabel>{t("use_wallet")}</FormLabel>
              <Checkbox
                value="wallet"
                label={t("wallet")}
                slotProps={{
                  input: { "aria-describedby": "female-helper-text" },
                }}
                checked={walletUsed} // Make sure walletUsed is defined in your state.
                onChange={(e) => {
                  handleWallateUsage(e);
                }} // Update the state based on the event.
              />
              <FormHelperText id="female-helper-text">
                {t("available_balance")}:
                <Typography
                  variant="body2"
                  fontWeight={"bold"}
                  color={wallet?.balance > 0 ? "success" : "danger"}
                >
                  {currency}
                  {Number(wallet?.balance).toFixed(2)}
                </Typography>
              </FormHelperText>
            </FormControl>
          </Box>

          <Box className="custom-tip" display={"flex"} alignItems={"center"}>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <OutlinedInput
                id="outlined-adornment-weight"
                color="error"
                value={note}
                size="small"
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("note_for_riders")}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
              />
            </FormControl>
            <IconButton
              color="success"
              variant="contained"
              onClick={() => handleNote()}
            >
              <FontAwesomeIcon icon={faAdd} />
            </IconButton>
          </Box>
          <div className="border"></div>
          <div className="bill-details-wrapper">
            <div className="bill-Typography-header">
              <Typography
                component={"span"}
                variant={"body2"}
                sx={{ fontWeight: "bold" }}
              >
                {t("bill_details")}
              </Typography>
            </div>
            <div className="bill-details">
              <TableContainer>
                <Table aria-label="simple table">
                  <TableBody>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="table-row"
                      >
                        {t("sub_total")}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "green" }}>
                        {currency}
                        {cartData && cartData.sub_total}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="table-row"
                      >
                        {t("charges_and_taxes")}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "green" }}>
                        {currency}
                        {cartData && tax_amount}
                      </TableCell>
                    </TableRow>

                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="table-row"
                      >
                        {t("delivery_charges")}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "green" }}>
                        {deliveryCharges?.is_free_delivery === "0"
                          ? `${currency}${parseFloat(
                              deliveryCharges.delivery_charge
                            ).toFixed(2)}`
                          : t("free_delivery")}
                      </TableCell>
                    </TableRow>

                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="table-row"
                      >
                        {t("total")}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "green" }}>
                        {currency}
                        {cartData && cartData.overall_amount}
                      </TableCell>
                    </TableRow>
                    {promoApplied && (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          className="table-row"
                        >
                          {t("promocode_discount")}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: "green", fontWeight: "bold" }}
                        >
                          -{currency}
                          {promoDiscount}
                        </TableCell>
                      </TableRow>
                    )}
                    {tip != null ? (
                      <>
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            className="table-row"
                          >
                            {t("delivery_tip")}
                          </TableCell>
                          <TableCell align="right" sx={{ color: "green" }}>
                            {currency}
                            {tip}

                            <Button
                              color="error"
                              value="10"
                              className="remove_tip"
                              onClick={(e) => handleRemoveTip()}
                            >
                              {t("remove")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : null}

                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        className="table-row"
                        sx={{ fontSize: "1.2rem !important" }}
                      >
                        {t("grand_total")}
                      </TableCell>
                      <TableCell align="right" sx={{ color: "green" }}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          sx={{ color: "green", fontSize: "1.1rem" }}
                        >
                          {currency}
                          {parseFloat(FinalTotal2).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItems;
