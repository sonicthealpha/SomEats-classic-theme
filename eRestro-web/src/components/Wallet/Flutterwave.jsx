import { Button } from "@mui/joy";
import React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { usePayment } from "../../context/PaymentContext";
import { useState } from "react";
import { selectpaymentData } from "../../store/reducers/settings";
import * as api from "../../utils/api";
import toast from "react-hot-toast";

import { createOrderId } from "../../utils/functions";

const Flutterwave = ({ amount }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { transactions } = usePayment();
  const [load, setLoad] = useState(false); // eslint-disable-next-line
  const [Cancleorders, setCancleOrder] = useState();

  const flutterwavepaykey = useSelector(selectpaymentData);

  const flutterwavepublishablekey =
    flutterwavepaykey.payment_method.flutterwave_public_key;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
    // eslint-disable-next-line
  }, []);

  const makePayment = () => {
    setLoad(true);

    if (amount == 0) {
      setLoad(false);
      return toast.error("Amount must be greater than zero");
    }

    // place_order

    window.FlutterwaveCheckout({
      public_key: flutterwavepublishablekey,
      tx_ref: "titanic-48981487343MDI0NzMx",
      amount: amount,
      currency: "NGN",
      payment_options: "card, mobilemoneyghana, ussd",
      callback: function (payment) {
        console.log(payment);
        if (payment.status === "successful") {
          api
            .add_transaction(
              "wallet",
              createOrderId(currentUser.id),
              "credit",
              "flutterwave",
              payment.transaction_id,
              parseFloat(amount).toFixed(2),
              payment.status,
              "Desposite Money"
            )
            .then((result) => {
              window.location.reload();
            });
        }
      },
      onclose: function (incomplete) {
        if (incomplete || window.verified === false) {
          return toast.error("Could not complete transactions");
        } else {
          document.querySelector("form").style.display = "none";
          if (window.verified === true) {
            document.querySelector("#payment-success").style.display = "block";
          } else {
            document.querySelector("#payment-pending").style.display = "block";
          }
        }
      },
      customer: {
        email: currentUser.email,
        phone_number: currentUser.mobile,
        name: currentUser.username,
      },
    });
  };

  return (
    <>
      <Button variant="outlined" color="danger" onClick={(e) => makePayment()}>
        {!load ? t("pay_now") : t("please_wait")}
      </Button>
    </>
  );
};

export default Flutterwave;
