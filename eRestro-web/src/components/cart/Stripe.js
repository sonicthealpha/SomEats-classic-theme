import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../context/AuthContext";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { usePayment } from "../../context/PaymentContext";
import { Button } from "@mui/material";
import { useState } from "react";
import * as api from "../../utils/api";
import { useSelector } from "react-redux";
import { selectpaymentData } from "../../store/reducers/settings";
import { useTranslation } from "react-i18next";

const CheckoutForm = ({ SelectedAddress }) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const { usercart } = useCart();
  const { Place_Order, transactions, setLoad, load } = usePayment(); // eslint-disable-next-line
  const [CancleOrder, setCancleOrder] = useState();
  var addons = usercart[0].product_details[0].variants[0].add_ons_data;
  var addonIds = addons.map((item) => item.add_on_id).join(", ");
  var addonQty = addons.map((item) => item.qty).join(", ");
  const stipekey = useSelector(selectpaymentData);
  const wallet = useSelector((state) => state.iswalletused)?.isWalletUsed;
  const userWallet = useSelector((state) => state.wallet)?.wallet;
  let isUsed = wallet.isUsed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    const variant_id = usercart
      .map((item) => item.product_variant_id)
      .join(", ");

    const qty = usercart.map((item) => item.qty).join(", ");
    const price = parseFloat(localStorage.getItem("price")).toFixed(2);
    const tip = localStorage.getItem("tip");
    console.log(userWallet[0]);

    api
      .place_order(
        variant_id,
        qty,
        price,
        isUsed === true ? 1 : 0,
        "stripe",
        "awaiting",
        SelectedAddress,
        tip,
        0,
        "",
        "",
        parseFloat(userWallet[0].balance) - parseFloat(price),
        localStorage.getItem("order_note")
      )
      .then((response) => {
        // Make the callback function async
        api.payment_intent(response.order_id, "stripe").then(async (res) => {
          console.log(res);
          localStorage.setItem("client_id", res.data.client_secret);

          const result = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement),
          });

          if (result.error) {
            return toast.error(result.error.message);
          } else {
            let get_client_id = localStorage.getItem("client_id");
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

            if (paymentResult.paymentIntent?.status == "succeeded") {
              const order_id = localStorage.getItem("order_id");
              transactions(
                order_id,
                "stripe",
                "stripe",
                paymentResult.paymentIntent.id,
                price
              );
            } else {
              const order_id = localStorage.getItem("order_id");
              api
                .delete_order(order_id)
                .then((response) => {
                  if (!response.error) {
                    setCancleOrder(response.data);
                  }
                })
                .catch(() => {});
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
                //   window.location.reload();
              });
            }
          }
        });
      });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <CardElement className="mt20 mb20" />
      <Button
        type="submit"
        disabled={!stripe || !elements}
        color="error"
        variant="outlined"
      >
        {!load ? t("pay_now") : t("please_wait")}
      </Button>
    </form>
  );
};

function Stripe({ SelectedAddress }) {
  const stipekey = useSelector(selectpaymentData);

  const stripepublishablekey = stipekey.payment_method.stripe_publishable_key;

  console.log(stripepublishablekey);

  const stripePromise = loadStripe(stripepublishablekey);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm SelectedAddress={SelectedAddress} />
    </Elements>
  );
}

export default Stripe;
