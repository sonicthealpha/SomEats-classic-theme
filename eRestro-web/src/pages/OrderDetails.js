import { Avatar, Grid, Typography, Button, Modal, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectData } from "../store/reducers/settings";
import * as api from "../utils/api";
import { ModalClose, ModalDialog } from "@mui/joy";
import { useTranslation } from "react-i18next";

const style = {
  width: { xs: "100%", md: 400 },
  maxWidth: { xs: "100%", md: 400 },
};

const OrderDetails = ({ order }) => {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open, setOpen] = React.useState(false);
  const data = useSelector(selectData);
  const currency = data.currency;
  const orders = order; 
  const { t } = useTranslation();
  
  return (
    <>
      <Button color="success" variant="outlined" onClick={handleOpen}>
        {t("order_details")}
      </Button>

      <Modal
        open={open}
        onClose={(e) => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // sx={{ maxWidth: "100%" }}
      >
        <ModalDialog
          color="neutral"
          variant="soft"
          sx={{ maxWidth: "100%", maxHeight: "100%", overflow: "auto" }}
        >
          <ModalClose onClick={(e) => handleClose()} />
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {t("order_summery")}
            </Typography>
            <div className="border" />
            <div>
              <div className="order-detail-img-wrapper">
                <Avatar
                  size="xl"
                  src={
                    orders &&
                    orders.order_items[0].partner_details[0].partner_profile
                  }
                />
                <div className="order-detail-desc">
                  <Typography variant="body1" component="p">
                    {orders &&
                      orders.order_items[0].partner_details[0].partner_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    sx={{ color: "var(--light-color--)" }}
                  >
                    {orders &&
                      orders.order_items[0].partner_details[0].partner_address}
                  </Typography>
                </div>
              </div>
              <div className="border" />
              <div className="order-details-wrapper">
                {orders &&
                  orders.order_items.map((order_data, index) => {
                    return (
                      <div key={index}>
                        <Typography
                          variant="body2"
                          component="p"
                          key={index}
                          sx={{ fontWeight: 600 }}
                        >
                          {order_data.product_name}
                        </Typography>
                        <Grid container>
                          <Grid item md={10}>
                            <Typography variant="body2" component="p">
                              <span>{order_data.quantity}</span> × {currency}
                              {order_data.price}
                            </Typography>
                          </Grid>
                          <Grid item md={2} sx={{ textAlign: "end" }}>
                            <Typography variant="body2" component="p">
                              {currency}
                              {order_data.sub_total}
                            </Typography>
                          </Grid>
                        </Grid>
                        <div className="border" />
                      </div>
                    );
                  })}
              </div>
              <div className="order-total">
                <Grid container>
                  <Grid item md={6} className="order-details">
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{ fontWeight: 600 }}
                    >
                     {t("total")}
                    </Typography>

                    <Typography variant="body1" component="p">
                      {t("taxes_and_charges")}
                    </Typography>

                    <Typography variant="body1" component="p">
                      {t("total_pay")}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    sx={{ textAlign: "end" }}
                    className="order-details"
                  >
                    <Typography
                      variant="body1"
                      component="p"
                      sx={{ fontWeight: 600 }}
                    >
                      {currency} {orders && orders.total}
                    </Typography>

                    <Typography variant="body1" component="p">
                      {currency}
                      {orders && orders.tax_amount}
                    </Typography>

                    <Typography
                      variant="body1"
                      component="p"
                      className="values"
                    >
                      {currency}
                      {orders && orders.total_payable}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              <div className="border" />
              <div className="total">
                <Grid container>
                  <Grid item md={6}>
                    <Typography variant="body1" component="p" className="bold">
                     {t("grand_total")}
                    </Typography>
                  </Grid>
                  <Grid item md={6} sx={{ textAlign: "end" }}>
                    <Typography variant="body1" component="p" className="bold">
                      {currency}
                      {orders && orders.total_payable}
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              <div className="border" />
              <div className="order-summary">
                <div className="order-payment-wrapper">
                  <div className="order-id order-style">
                    <Typography variant="body1" component="p">
                      {t("order_id")}
                    </Typography>
                    <Typography
                      className="mb20 light"
                      variant="body2"
                      component="p"
                    >
                      {orders && orders.order_items[0].order_id}
                    </Typography>
                  </div>
                  <div className="order-id order-style">
                    <Typography variant="body1" component="p">
                      OTP
                    </Typography>
                    <Typography
                      className="mb20 light"
                      variant="body2"
                      component="p"
                    >
                      {orders && orders.otp}
                    </Typography>
                  </div>
                  <div className="payment-type order-style">
                    <Typography variant="body1" component="p">
                      {t("payment")}
                    </Typography>
                    <Typography
                      className="mb20 light"
                      variant="body2"
                      component="p"
                    >
                      paid : using {orders && orders.payment_method}
                    </Typography>
                  </div>
                  <div className="order-date order-style">
                    <Typography variant="body1" component="p">
                      {t("date")}
                    </Typography>
                    <Typography
                      className="mb20 light"
                      variant="body2"
                      component="p"
                    >
                      {orders && orders.date_added}
                    </Typography>
                  </div>
                  <div className="order-phonenum order-style">
                    <Typography variant="body1" component="p">
                      {t("phone_number")}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="p"
                      className="light mb20"
                    >
                      {orders && orders.mobile.substring(0, 7)}×××
                    </Typography>
                  </div>
                  <div className="order-phonenum order-style">
                    <Typography variant="body1" component="p">
                      {t("deliver_to")}
                    </Typography>
                    <Typography variant="body2" component="p" className="light">
                      {orders && orders.address}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="contained"
              fullWidth
              onClick={handleClose}
              color="error"
              className="mt20"
              sx={{ textTransform: "capitalize" }}
            >
              {t("close")}
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
};

export default OrderDetails;
