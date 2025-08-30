import React, { useEffect, useState } from "react";
import * as api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Typography } from "@mui/material";

const Invoice = () => {
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState();

  useEffect(() => {
    api
      .get_orders(currentUser.id)
      .then((response) => {
        if (!response.error) {
          setOrders(response.data[0]);
        }
      })
      .catch(() => {});
  }, [currentUser.id]);

  return (
    <div>
      <Typography
        varient="h6"
        component="h5"
        dangerouslySetInnerHTML={{ __html: orders && orders.invoice_html }}
      />
    </div>
  );
};

export default Invoice;
