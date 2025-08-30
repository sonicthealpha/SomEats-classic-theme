import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { useCart } from "../../context/CartContext";
import * as api from "../../utils/api";
import { useNavigate } from "react-router";
import { Box } from "@mui/joy";
import toast from "react-hot-toast";

const Paypal = ({ SelectedAddress, deliveryType }) => {
  const { usercart } = useCart();

  const navigate = useNavigate();

  const totalAmount = parseFloat(localStorage.getItem("price")).toFixed(2);

  const settings = useSelector((state) => state.settings)?.data;

  const currency_code = settings?.system_settings[0]?.supported_locals;

  const payment_gateway_settings = useSelector((state) => state.settings)
    ?.payment_data?.payment_method;
  const client_id = payment_gateway_settings?.paypal_client_id;
  const secret = payment_gateway_settings?.paypal_secret_key;

  const variant_id = usercart.map((item) => item.product_variant_id).join(", ");
  const qty = usercart.map((item) => item.qty).join(", ");

  const wallet = useSelector((state) => state.iswalletused)?.isWalletUsed;
  const userWallet = useSelector((state) => state.wallet)?.wallet;
  let isUsed = wallet.isUsed;

  return (
    <Box m={5}>
      <PayPalScriptProvider options={{ "client-id": client_id }}>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD", // Use the appropriate currency code
                    value: totalAmount,
                  },
                },
              ],
            });
          }}
          style={{
            layout: "vertical",
            tagline: false,
            color: "gold",
            shape: "rect",
          }}
          onApprove={(data, actions) => {
            // alert(`Payment Successful: ${customCurrencySymbol}100.00`);
            api
              .place_order(
                variant_id,
                qty,
                totalAmount,
                isUsed === true ? 1 : 0,
                "COD",
                "pending",
                SelectedAddress,
                "",
                deliveryType,
                "",
                "",
                parseFloat(userWallet[0].balance) - parseFloat(totalAmount),
                localStorage.getItem("order_note")
              )
              .then((res) => {
                if (res.error === false) {
                  localStorage.removeItem("order_note");
                  api
                    .add_transaction(
                      "transaction",
                      res.order_id,
                      "paypal",
                      "paypal",
                      data.orderID,
                      totalAmount,
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
          }}
          onError={(err) => {
            toast.err(err);
            // Handle payment errors here
          }}
          onCancel={(data) => {
            // Handle payment cancellation here
          }}
        />
      </PayPalScriptProvider>
    </Box>
  );
};

export default Paypal;
