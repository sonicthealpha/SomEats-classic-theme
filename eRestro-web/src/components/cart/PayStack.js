import { React, useEffect } from "react";
import { Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { usePayment } from "../../context/PaymentContext";
import { useState } from "react";
import * as api from "../../utils/api";
import { useSelector } from "react-redux";
import { selectpaymentData } from "../../store/reducers/settings";
import { payStackInit } from "../../utils/functions";
import { useTranslation } from "react-i18next";

const PayStack = ({ SelectedAddress }) => {
  useEffect(() => {
    payStackInit();
  }, []);

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth();
  const { usercart } = useCart();
  const { Place_Order, orders, transactions, setLoad, load } = usePayment(); // eslint-disable-next-line
  const [Cancleorders, setCancleOrder] = useState();

  const razorpaykey = useSelector(selectpaymentData);

  const pgDetails = razorpaykey.payment_method;

  const qty = usercart.map((item) => item.qty).join(", ");
  const tip = localStorage.getItem("tip");
  const price = parseFloat(localStorage.getItem("price")).toFixed(2);
  const order_id = localStorage.getItem("order_id");
  const variant_id = usercart.map((item) => item.product_variant_id).join(", ");

  var addons = usercart[0].product_details[0].variants[0].add_ons_data;
  var addonIds = addons.map((item) => item.add_on_id).join(", ");
  var addonQty = addons.map((item) => item.qty).join(", ");
  //   console.log(ids);

  const handlePayment = () => {
    setIsLoading(true);
    Place_Order(
      variant_id,
      qty,
      price,
      0,
      "paystack",
      "awaiting",
      SelectedAddress,
      tip,
      "paystack"
    );
    const handler = window.PaystackPop.setup({
      key: pgDetails.paystack_key_id, // Replace with your Paystack public key
      email: currentUser.email, // Replace with
      amount: price * 100, // Amount in kobo
      currency: "NGN", // Replace with your desired currency code
      callback: (response) => {
        // This function is called after a successful payment
        console.log(response);
        transactions(
          order_id,
          "paystack",
          "paystack",
          response.reference,
          price
        );
        setIsLoading(false);
      },
      onClose: () => {
        // This function is called when the payment window is closed
        api.delete_order(order_id).then((response) => {
          if (!response.error) {
            setCancleOrder(response.data);
          }
        });

        const addToCartPromise = new Promise((resolve, reject) => {
          api
            .add_to_cart(variant_id, qty, "", "", addonIds, addonQty)
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });

        // Wait for the add_to_cart promise to resolve before reloading the page
        addToCartPromise.then(() => {
          window.location.reload();
        });
        setIsLoading(false);
      },
    });
    handler.openIframe();
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handlePayment}
      disabled={isLoading}
    >
      {!isLoading ? t("pay_now") : t("please_wait")}
    </Button>
  );
};

export default PayStack;
