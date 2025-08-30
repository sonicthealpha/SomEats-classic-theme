import React from "react";
import { useSelector } from "react-redux";
import { selectpaymentData } from "../../store/reducers/settings";
import toast from "react-hot-toast";

import { createOrderId } from "../../utils/functions";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../utils/api";
import { Button } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const RazorPay = ({ amount }) => {
  const { t } = useTranslation();
  //TODO:after reciving what to do with oprder id need to fix this
  const razorpaykey = useSelector(selectpaymentData);

  const razorpaypublishablekey = razorpaykey.payment_method.razorpay_key_id;
  const { currentUser } = useAuth();
  const orderId = createOrderId(currentUser.id);

  const [load, setLoad] = useState(false);

  api.payment_intent(orderId, "razorpay").then((result) => {
    console.log(result);
  });

  const MakePayment = () => {
    if (amount <= 0) {
      return toast.error("Amount must be greater than zero");
    }

    // setLoad(true);
    const options = {
      key: razorpaypublishablekey,
      amount: amount * 100,
      name: "eRestro",
      description: "eRestro",
      order_id: orderId,
      prefill: {
        contact: currentUser.mobile,
        email: currentUser.email,
      },
      notes: {
        order_id: orderId,
      },

      handler: function (response) {
        console.log(response);
        // api.add_transaction(
        //     "transaction",
        //     res.order_id,
        //     "paypal",
        //     "paypal",
        //     data.orderID,
        //     totalAmount,
        //     "success",
        //     localStorage.getItem('order_note')
        // ).then(res => {
        //     if (res.error === false) {

        //     }
        // });
      },
      modal: {
        ondismiss: function () {
          toast.error("Transaction was canceled.");
        },
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <Button variant="outlined" onClick={(e) => MakePayment()} color="danger">
      {!load ? t("pay_now") : t("please_wait")}
    </Button>
  );
};

export default RazorPay;
