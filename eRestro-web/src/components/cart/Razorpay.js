import React from "react";
import { Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { usePayment } from "../../context/PaymentContext";
import { useState } from "react";
import * as api from "../../utils/api";
import { useSelector } from "react-redux";
import { selectpaymentData } from "../../store/reducers/settings";
import { useTranslation } from "react-i18next";

const Razorpay = ({ SelectedAddress, isRechargWallet }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { usercart } = useCart();
  const { Place_Order, orders, transactions, setLoad, load } = usePayment(); // eslint-disable-next-line
  const [Cancleorders, setCancleOrder] = useState();

  const razorpaykey = useSelector(selectpaymentData);

  const razorpaypublishablekey = razorpaykey.payment_method.razorpay_key_id;

  var addons = usercart[0].product_details[0].variants[0].add_ons_data;
  var addonIds = addons.map((item) => item.add_on_id).join(", ");
  var addonQty = addons.map((item) => item.qty).join(", ");

  const MakePayment = () => {
    setLoad(true);
    const variant_id = usercart
      .map((item) => item.product_variant_id)
      .join(", ");

    const qty = usercart.map((item) => item.qty).join(", ");

    const price = parseFloat(localStorage.getItem("price")).toFixed(2);
    const tip = localStorage.getItem("tip");
    const order_id = localStorage.getItem("order_id");

    // if(isRechargWallet === true) {

    // }
    Place_Order(
      variant_id,
      qty,
      price,
      0,
      "razorpay",
      "awaiting",
      SelectedAddress,
      tip,
      "razorpay"
    );

    //   razorpay
    const options = {
      key: razorpaypublishablekey,
      amount: price * 100,
      name: "eRestro",
      description: "eRestro",
      order_id: orders,
      prefill: {
        contact: currentUser.mobile,
        email: currentUser.email,
      },
      notes: {
        order_id: order_id,
      },

      handler: function (response) {
        const order_id = localStorage.getItem("order_id");
        transactions(
          order_id,
          "razorpay",
          "razorpay",
          response.razorpay_payment_id,
          price
        );
      },
      modal: {
        ondismiss: function () {
          const place_order_id = localStorage.getItem("order_id");
          api.delete_order(place_order_id).then((response) => {
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
        },
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();

    rzp1.on("payment.failed", function () {
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
    });
  };

  return (
    <Button variant="outlined" onClick={(e) => MakePayment()} color="error">
      {!load ? t("pay_now") : t("please_wait")}
    </Button>
  );
};

export default Razorpay;
