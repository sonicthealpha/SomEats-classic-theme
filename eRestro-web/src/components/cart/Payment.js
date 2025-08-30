import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { useState } from "react";
import CodPayment from "./CodPayment";
import Flutterwave from "./Flutterwave";
import Razorpay from "./Razorpay";
import Stripe from "./Stripe";
import PayStack from "./PayStack";
import { useSelector } from "react-redux";
import Paypal from "./Paypal";
import { t } from "i18next";

const Payment = ({
  SelectedAddress = "",
  deliveryType = "",
  walletRecharge = false,
}) => {
  const [status, setStatus] = useState(0);
  const paymentHandler = (active_status) => {
    setStatus(active_status);
  };

  const settings = useSelector((state) => state.settings)?.payment_data
    ?.payment_method;

  return (
    <div className="payment-wrapper">
      <RadioGroup
        aria-labelledby="demo-form-control-label-placement"
        name="position"
        className="payment"
        defaultValue="top"
      >
        {walletRecharge === true ? (
          ""
        ) : (
          <FormControlLabel
            value="cod"
            control={<Radio />}
            label={t("cash_on_delivery")}
            onClick={(e) => paymentHandler(1)}
          />
        )}

        <FormControlLabel
          value="razorpay"
          control={<Radio />}
          label={t("razorpay")}
          onClick={(e) => paymentHandler(2)}
        />
        {settings.paypal_payment_method === "1" ||
        settings.paypal_payment_method === 1 ? (
          <FormControlLabel
            value="paypal"
            control={<Radio />}
            label={t("paypal")}
            onClick={(e) => paymentHandler(6)}
          />
        ) : (
          ""
        )}

        {settings.stripe_payment_method === "1" ||
        settings.stripe_payment_method === 1 ? (
          <FormControlLabel
            value="stripe"
            control={<Radio />}
            label={t("stripe")}
            onClick={(e) => paymentHandler(3)}
          />
        ) : (
          ""
        )}

        {settings.flutterwave_payment_method === "1" ||
        settings.flutterwave_payment_method === 1 ? (
          <FormControlLabel
            value="Flutterwave"
            control={<Radio />}
            label={t("flutterwave")}
            onClick={(e) => paymentHandler(4)}
          />
        ) : (
          ""
        )}
        {settings.paystack_payment_method === "1" ||
        settings.paystack_payment_method === 1 ? (
          <FormControlLabel
            value="PayStack"
            control={<Radio />}
            label={t("paystack")}
            onClick={(e) => paymentHandler(5)}
          />
        ) : (
          ""
        )}
      </RadioGroup>
      {status === 1 && (
        <>
          <CodPayment
            SelectedAddress={SelectedAddress}
            deliveryType={deliveryType}
          />
        </>
      )}
      {status === 2 && (
        <>
          <Razorpay
            SelectedAddress={SelectedAddress}
            deliveryType={deliveryType}
            isRechargWallet={walletRecharge}
          />
        </>
      )}
      {status === 3 && (
        <>
          <Stripe
            SelectedAddress={SelectedAddress}
            deliveryType={deliveryType}
            isRechargWallet={walletRecharge}
          />
        </>
      )}
      {status === 4 && (
        <>
          <Flutterwave
            SelectedAddress={SelectedAddress}
            deliveryType={deliveryType}
            isRechargWallet={walletRecharge}
          />
        </>
      )}
      {status === 5 && (
        <>
          <PayStack
            SelectedAddress={SelectedAddress}
            deliveryType={deliveryType}
            isRechargWallet={walletRecharge}
          />
        </>
      )}
      {status === 6 && (
        <>
          <Paypal
            SelectedAddress={SelectedAddress}
            deliveryType={deliveryType}
            isRechargWallet={walletRecharge}
          />
        </>
      )}
    </div>
  );
};

export default Payment;
