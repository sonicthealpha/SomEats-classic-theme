import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { useCart } from "../../context/CartContext";
import * as api from "../../utils/api";
import { Box } from "@mui/joy";
import toast from "react-hot-toast";

import { createOrderId } from "../../utils/functions";
import { useAuth } from "../../context/AuthContext";

const PayPal = ({ amount }) => {
  const { usercart } = useCart();

  console.log(usercart);

  const totalAmount = usercart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  console.log(totalAmount);

  const settings = useSelector((state) => state.settings)?.data;

  const currency_code = settings?.system_settings[0]?.supported_locals;

  const payment_gateway_settings = useSelector((state) => state.settings)
    ?.payment_data?.payment_method;
  const client_id = payment_gateway_settings?.paypal_client_id;

  const note = localStorage.getItem("order_note");

  console.log(note);
  const { currentUser } = useAuth();

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
                    value: parseFloat(amount),
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
            console.log(data);
            // alert(`Payment Successful: ${customCurrencySymbol}100.00`);
            api
              .add_transaction(
                "wallet",
                createOrderId(currentUser.id),
                "credit",
                "paypal",
                data.orderID,
                parseFloat(amount),
                "success",
                localStorage.getItem("order_note")
              )
              .then((res) => {
                if (res.error === true) {
                  toast.error(res.message);
                } else {
                  toast.success(res.message);
                }
              })
              .then((x) => {
                window.location.reload();
              });
          }}
          onError={(err) => {
            console.log(err);
            // toast.error(err);
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

export default PayPal;
