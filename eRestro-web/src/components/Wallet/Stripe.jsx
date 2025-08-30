import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../context/AuthContext";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectpaymentData } from "../../store/reducers/settings";
import { Button } from "@mui/joy";
import * as api from "../../utils/api";
import toast from "react-hot-toast";

import { createOrderId } from "../../utils/functions";

const CheckoutForm = ({ amount }) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [load, setLoad] = useState(false);

  // api.payment_intent("")

  const stipekey = useSelector(selectpaymentData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    api
      .payment_intent(createOrderId(currentUser.id), "stripe")
      .then(async (res) => {
        console.log(res);

        const result = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

        if (result.error) {
          return toast.error(result.error.message);
        } else {
          const paymentResult = await stripe.confirmCardPayment(
            res.data.client_secret,
            {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                  name: currentUser.user_name,
                },
              },
            }
          );

          console.log(paymentResult);

          if (paymentResult.paymentIntent?.status === "succeeded") {
            api
              .add_transaction(
                "wallet",
                createOrderId(currentUser.id),
                "credit",
                "stripe",
                paymentResult.paymentIntent?.id,
                parseFloat(amount),
                "success",
                localStorage.getItem("order_note")
              )
              .then((res) => {
                if (res.error === false) {
                  toast.success(res.message);
                } else {
                  toast.error(res.message);
                }
              })
              .then(() => {
                window.location.reload();
              });
          } else {
          }
        }
      });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <CardElement className="mt20 mb20" />
      <Button
        type="submit"
        disabled={!stripe || !elements}
        color="danger"
        variant="outlined"
      >
        {!load ? t("pay_now") : t("please_wait")}
      </Button>
    </form>
  );
};

function Stripe({ amount }) {
  const stipekey = useSelector(selectpaymentData);

  const stripepublishablekey = stipekey.payment_method.stripe_publishable_key;

  console.log(stripepublishablekey);

  const stripePromise = loadStripe(stripepublishablekey);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
}

export default Stripe;
