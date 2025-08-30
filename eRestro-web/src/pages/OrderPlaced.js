import { Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from ".././context/CartContext";

const OrderPlaced = () => {
  const {
    clearCart, // eslint-disable-next-line
  } = useCart();
  useEffect(() => {
    const timer = setTimeout(() => {
      clearCart();
    }, 1000);
  
    // Clean up the timer to avoid memory leaks
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <div className="confirmed-order">
      <div className="confirmed-img">
        <img
          src={process.env.PUBLIC_URL + "/images/confirmed.gif"}
          alt="confirmed"
        />
      </div>
      <Typography variant="h5" component="h5" sx={{ fontWeight: "bold" }}>
        <span className="highlight">Congratulations</span> Your order placed
        successfully!
      </Typography>
      <Link to="/">
        <Button
          variant="outlined"
          color="error"
          sx={{ textAlign: "center" }}
          className="mt20"
        >
          Order Some More Food
        </Button>
      </Link>
    </div>
  );
};

export default OrderPlaced;
