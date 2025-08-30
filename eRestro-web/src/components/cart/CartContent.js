import { useState, useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container, Grid, Paper } from "@mui/material/";
import Address from "./Address";
import Layout from "../layouts/Layout";
import Breadcrumbs from "../breadcrumbs";
import CartItems from "./CartItems";
import Payment from "./Payment";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useAddress } from "../../context/AddressContext";
import { useCart } from "../../context/CartContext";
import { useTranslation } from "react-i18next";
import Cart from "../placeholders/Cart";
import { useSelector, useDispatch } from "react-redux";
import * as api from "../../utils/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { createOrderId } from "../../utils/functions";
import { setDetails } from "../../store/reducers/CartDetails";

const CartContent = () => {
  const { addresses } = useAddress();
  const [SelectedAddress, setSelectedAddress] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [count, setCount] = useState(0);
  const { usercart, loading } = useCart();

  const [deliveryType, setDeliveryType] = useState(0);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setDetails(cartData?.data));
    if (count > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }, [count]);

  const wallet = useSelector((state) => state.iswalletused)?.isWalletUsed;
  const currentBalance = useSelector((state) => state.wallet)?.wallet;

  let amount = wallet.total_amount;

  const handleReset = () => {
    setActiveStep(0);
    setSelectedAddress("");
    setCount(0);
  };

  useEffect(() => {
    console.log(deliveryType);
  }, [setDeliveryType]);

  console.log(usercart);

  const variant_id = usercart
    ? usercart?.map((item) => item.product_variant_id).join(", ")
    : "";
  const qty = usercart ? usercart?.map((item) => item.qty).join(", ") : "";
  const { currentUser } = useAuth();

  const { cartData } = useCart();

  const navigate = useNavigate();

  const placeOrder = () => {
    api
      .place_order(
        variant_id,
        qty,
        cartData.overall_amount,
        1,
        "wallet",
        "awaiting",
        SelectedAddress,
        0,
        "",
        "",
        "",
        amount < 0 ? cartData.overall_amount : amount
      )
      .then((res) => {
        if (res.error === false) {
          localStorage.removeItem("order_note");
          api
            .add_transaction(
              "transaction",
              res.order_id,
              "wallet",
              "wallet",
              createOrderId(currentUser.id),
              cartData.overall_amount,
              "success",
              localStorage.getItem("order_note")
            )
            .then((res) => {
              if (res.error === false) {
                api.clearCart();
                navigate("/confirmed");
              }
            });
        } else {
          toast.error(res.message);
          console.log(res);
        }
      });
  };

  return (
    <Layout title={t("cart")}>
      <Breadcrumbs crumb={t("cart")} />
      <Container sx={{ mt: "30px" }}>
        {loading ? (
          <Cart />
        ) : (
          <>
            {usercart != null && usercart.length > 0 ? (
              <Grid container spacing={2}>
                <Grid item md={8}>
                  <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
                    color="error"
                  >
                    {deliveryType == 0 ? (
                      <Step>
                        <StepLabel>{t("Address")}</StepLabel>
                        <StepContent>
                          <Address
                            addresses={addresses}
                            setSelectedAddress={setSelectedAddress}
                            SelectedAddress={SelectedAddress}
                            count={setCount}
                          />
                        </StepContent>
                      </Step>
                    ) : null}
                    <Step>
                      <StepLabel>{t("payment")}</StepLabel>
                      <StepContent>
                        {amount > 0 ? (
                          <Payment
                            SelectedAddress={SelectedAddress}
                            deliveryType={deliveryType}
                          />
                        ) : (
                          <Button
                            color="warning"
                            variant="contained"
                            onClick={(e) => placeOrder()}
                          >
                            {t("place_order")}
                          </Button>
                        )}
                        <Paper square elevation={0} sx={{ p: 3 }}>
                          <Typography>{t("all_steps_completed")}</Typography>
                          {deliveryType == 0 && (
                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                              {t("go_back")}
                            </Button>
                          )}
                        </Paper>
                      </StepContent>
                    </Step>
                  </Stepper>
                </Grid>
                <Grid
                  item
                  md={4}
                  className="cart-items-wrapper"
                  sx={{ margin: "auto" }}
                >
                  <CartItems
                    SelectedAddress={SelectedAddress}
                    setDeliveryType={setDeliveryType}
                  />
                </Grid>
              </Grid>
            ) : (
              <>
                <div className="no-cart-data">
                  <img
                    src={process.env.PUBLIC_URL + "/images/empty.jpg"}
                    alt="empty cart"
                  />
                  <Typography
                    variant="h6"
                    component="h5"
                    sx={{ textAlign: "center" }}
                  >
                    {t("no_order_yet")}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="h5"
                    sx={{ textAlign: "center" }}
                  >
                    {t("looks_like_you_have_not_made_your_choice_yet")}
                  </Typography>
                  <Link to="/restaurants">
                    <Button variant="outlined" color="error">
                      {t("browse_menu")}
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </Container>
    </Layout>
  );
};

export default CartContent;
