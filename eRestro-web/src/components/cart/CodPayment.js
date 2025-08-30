import { Button } from "@mui/material";
import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import * as api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import toast from "react-hot-toast";
import { usePayment } from "../../context/PaymentContext";

const CodPayment = ({ SelectedAddress, deliveryType }) => {
  const { usercart } = useCart(); // eslint-disable-next-line
  const [orders, setOrders] = useState();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  // const { transactions } = usePayment(); // eslint-disable-next-line

  const paymentHandler = async () => {
    try {
      const variant_id = usercart
        .map((item) => item.product_variant_id)
        .join(", ");
      const qty = usercart.map((item) => item.qty).join(", ");
      const price = parseFloat(localStorage.getItem("price")).toFixed(2);
      console.log("cash on delivery", price);

      setLoad(true);
      const response = await api.place_order(
        variant_id,
        qty,
        price,
        0,
        "COD",
        "pending",
        SelectedAddress,
        "",
        deliveryType,
        "",
        "",
        "",
        localStorage.getItem("order_note")
      );
      if (response.error) {
        toast.error(response.message);
      } else {
        console.log("response f the place", response);
        localStorage.setItem("order_id", response.order_id);
        setLoad(false);
        setOrders(response.data);
        navigate("/confirmed");
        await ADD_TRASACTION(price);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ADD_TRASACTION = (price) => {
    return new Promise((resolve, reject) => {
      const order_id = localStorage.getItem("order_id");
      api
        .add_transaction(
          "transaction",
          order_id,
          "COD",
          "COD",
          1,
          price,
          "success",
          "message"
        )
        .then(() => {
          localStorage.removeItem("order_id");
          window.location.reload();
          resolve(); // Resolve the promise
        })
        .catch((error) => {
          reject(error); // Reject the promise in case of error
        });
    });
  };

  return (
    <div>
      <Button variant="outlined" onClick={paymentHandler} color="error">
        {!load ? t("pay_now") : t("please_wait")}
      </Button>
    </div>
  );
};

export default CodPayment;
