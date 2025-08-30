import { React, useEffect } from "react";
import { Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import * as api from "../../utils/api";
import { useSelector } from "react-redux";
import { selectpaymentData } from "../../store/reducers/settings";
import { createOrderId, payStackInit } from "../../utils/functions";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

const PayStack = ({ amount }) => {
  useEffect(() => {
    payStackInit();
  }, []);

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useAuth();

  const razorpaykey = useSelector(selectpaymentData);

  const pgDetails = razorpaykey.payment_method;

  //   console.log(ids);

  const handlePayment = () => {
    setIsLoading(true);

    if (amount <= 0) {
      setIsLoading(false);
      return toast.error("Amount must be greater than zero");
    }

    const handler = window.PaystackPop.setup({
      key: pgDetails.paystack_key_id, // Replace with your Paystack public key
      email: currentUser.email, // Replace with
      amount: amount * 100, // Amount in kobo
      currency: "NGN", // Replace with your desired currency code
      callback: (response) => {
        // This function is called after a successful payment
        console.log(response);
        api
          .add_transaction(
            "wallet",
            createOrderId(currentUser.id),
            "credit",
            "paystack",
            response.transaction,
            parseFloat(amount),
            response.status,
            localStorage.getItem("order_note")
          )
          .then((res) => {
            setIsLoading(false);
            if (res.error === true) {
              toast.error(res.message);
            } else {
              toast.success(res.message);
            }
          });
      },
      onClose: () => {
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
