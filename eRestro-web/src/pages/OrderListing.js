import { Button, CardMedia, Grid, Pagination, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import OrderDetails from "./OrderDetails";
import Nofound from "./Nofound";
import { useSelector } from "react-redux";
import { selectData } from "../store/reducers/settings";
import { toast } from "react-hot-toast";
import { StarBorderOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/joy";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import RateOrder from "../components/Modal/RateOrder";
import RateProduct from "../components/Modal/RateProduct";
import Chip from "@mui/material/Chip";

import RateRider from "../components/Modal/RateRider";
import ApiErrorPage from "./ApiErrorPage";

const OrderListing = () => {
  const data = useSelector(selectData);
  const { t } = useTranslation();
  const currency = data.currency;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [per_page] = useState(3);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(0); // State to track selected tab index

  const [rateModal, setRateModal] = useState(false);
  const [orderID, setOrderID] = useState(0);

  const [productRateModal, setProductRateModal] = useState(false);
  const [productID, setProductID] = useState(0);

  const [riderRateModal, setRiderRateModal] = useState(false);
  const [riderID, setRiderID] = useState(0);
  const [activeStatus, setActiveStatus] = useState("");

  const [apiError, setApiError] = useState(false);

  var status = [
    "all",
    "awaiting",
    "pending",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const Orders = (offset = 0, status = activeStatus) => {
    setApiError(false);
    setLoading(true);

    api
      .get_orders("", per_page, offset, status)
      .then((response) => {
        if (!response.error) {
          var totalPages = parseInt(response.total) / per_page;
          totalPages = Math.ceil(totalPages);
          setPage(totalPages);
          setOrders(response.data);
          setLoading(false);
        } else {
          setLoading(false);
          setOrders([]);
        }
      })
      .catch(() => {
        setApiError(true);
      });
  };

  useEffect(() => {
    Orders();
    // eslint-disable-next-line
  }, []);

  const CancleOrder = (id) => {
    api
      .update_order_status("cancelled", id, "test")
      .then((response) => {
        if (!response.error) {
          setOrders(response.data);
        }
        if (response.error === true) {
          toast.error(response.message);
          setOrders(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePageChange = (event, selectedPage) => {
    if (currentPage !== selectedPage) {
      const offset = (selectedPage - 1) * per_page;
      setCurrentPage(selectedPage);
      Orders(offset, activeStatus);
    }
  };

  const handleStatusChange = (e, value) => {
    let active_status = status[value];
    setCurrentPage(1);
    setSelectedTab(value);
    if (active_status !== "all") {
      Orders(0, active_status);
      setActiveStatus(active_status);
    } else {
      Orders(0, "");
      setActiveStatus("");
    }
  };

  return (
    <>
      {!apiError ? (
        <>
          {loading ? (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              fontSize={"16px"}
            >
              Loading...Please Wait!
            </Box>
          ) : (
            <>
              <Box mt={-3}>
                <Box
                  mb={2}
                  sx={{
                    flexGrow: 1,
                    borderBottom: 1,
                    borderColor: "divider",
                    maxWidth: { xs: 340, sm: 580, md: 755, lg: "100%" },
                    bgcolor: "background.paper",
                  }}
                >
                  <Tabs
                    value={selectedTab}
                    onChange={handleStatusChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="scrollable auto tabs example"
                    sx={{
                      "& .Mui-selected": {
                        color: "var(--primary-color--)",
                        backgroundColor: "var(--tab-bgColor--)",
                      },
                    }}
                  >
                    {status.map((s, i) => (
                      <Tab key={i} label={s.replaceAll(/_/g, " ")} />
                    ))}
                  </Tabs>
                </Box>
                {orders && orders.length !== 0 ? (
                  <>
                    {orders.map((order, index) => {
                      if (
                        !order ||
                        !order.order_items ||
                        order.order_items.length === 0
                      )
                        return null;
                      const {
                        order_items,
                        total_payable,
                        active_status,
                        id,
                        address,
                      } = order;

                      const cancelable_till = order_items[0].cancelable_till;
                      var cancellable_index = status.indexOf(cancelable_till);
                      var active_index = status.indexOf(active_status);

                      return (
                        <div className="order-wrapper" key={index}>
                          <div className="order-content-wrapper">
                            <Grid container spacing={3}>
                              <Grid item md={2.5} sm={3.5} lg={2.2}>
                                <div className="order-image-wrapper">
                                  <CardMedia
                                    component="img"
                                    sx={{
                                      marginLeft: {
                                        xs: 0.5,
                                        sm: 0,
                                      },
                                    }}
                                    alt={order_items[0].name}
                                    height="140"
                                    image={
                                      order_items[0].partner_details[0]
                                        .partner_profile
                                    }
                                  />
                                </div>
                              </Grid>
                              <Grid
                                item
                                md={9.5}
                                sm={8.5}
                                lg={9.8}
                                mt={{ xs: -3, sm: 0 }}
                              >
                                <div className="order-name-wrapper">
                                  <Grid container>
                                    <Grid item sm={7} md={8} lg={8}>
                                      <Typography
                                        variant="h6"
                                        component="h5"
                                        ml={{ xs: 1.5, sm: 2.5 }}
                                      >
                                        {
                                          order_items[0].partner_details[0]
                                            .partner_name
                                        }
                                      </Typography>
                                      <Typography
                                        ml={{ xs: 1.5, sm: 2.5 }}
                                        variant="body2"
                                        component="h5"
                                        color="var(--light-color--)"
                                      >
                                        {address}
                                      </Typography>
                                    </Grid>
                                    <Grid
                                      item
                                      sm={5}
                                      md={4}
                                      lg={4}
                                      sx={{
                                        textAlign: "end",
                                        ml: {
                                          xs: 2,
                                          sm: 0,
                                        },
                                      }}
                                    >
                                      <Chip
                                        label={t(active_status)}
                                        color={
                                          active_status === "preparing"
                                            ? "secondary"
                                            : active_status === "pending" ||
                                              active_status === "awaiting"
                                            ? "warning"
                                            : active_status === "delivered"
                                            ? "success"
                                            : active_status ===
                                              "out_for_delivery"
                                            ? "info"
                                            : active_status === "cancelled"
                                            ? "error"
                                            : "default"
                                        }
                                        sx={{
                                          fontWeight: "bold",
                                          minWidth: "90px",
                                        }}
                                        variant="outlined"
                                      />
                                    </Grid>
                                  </Grid>
                                  {order.order_items.map(
                                    (order_data, index) => {
                                      const { product_name, quantity } =
                                        order_data;
                                      return (
                                        <Typography
                                          variant="subtitle1"
                                          component="h5"
                                          className="order-summary ml20"
                                          key={index}
                                        >
                                          {product_name} ×{" "}
                                          <Typography
                                            sx={{
                                              color: "var(--light-color--)",
                                            }}
                                          >
                                            {quantity}
                                          </Typography>
                                        </Typography>
                                      );
                                    }
                                  )}
                                  <Typography
                                    variant="body2"
                                    component="h5"
                                    color="var(--light-color--)"
                                    className="order-summary ml20"
                                  >
                                    {order_items[0].date_added}
                                  </Typography>
                                </div>
                              </Grid>
                            </Grid>
                            <div className="border" />
                            <div className="total-amount">
                              <Grid container>
                                <Grid
                                  item
                                  md={6}
                                  className="bill-detail-wrapper"
                                >
                                  <Typography
                                    variant="subtitle1"
                                    component="h5"
                                  >
                                    {t("total_pay")}
                                  </Typography>
                                </Grid>
                                <Grid item md={6}>
                                  <Typography
                                    variant="subtitle1"
                                    component="h5"
                                    sx={{ textAlign: "end", color: "green" }}
                                  >
                                    {currency} {total_payable}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </div>
                            <div className="border" />
                            <Box
                              display={"flex"}
                              maxWidth={"100%"}
                              gap={{ xs: 2, md: 1 }}
                              flexDirection={{ xs: "column", md: "row" }}
                              justifyContent={{
                                xs: "center",
                                md: "flex-start",
                              }}
                            >
                              <OrderDetails order={order} />
                              {order_items[0].is_cancelable === 1 &&
                              active_index <= cancellable_index ? (
                                <Button
                                  key={index}
                                  variant="contained"
                                  color="error"
                                  onClick={(e) => CancleOrder(id)}
                                >
                                  {t("cancel_order")}
                                </Button>
                              ) : null}
                              {active_status === "delivered" ? (
                                <Box
                                  display={"flex"}
                                  maxWidth={"100%"}
                                  gap={{ xs: 2, md: 1 }}
                                  flexDirection={{ xs: "column", md: "row" }}
                                >
                                  <Button
                                    key={index}
                                    variant="outlined"
                                    color="info"
                                    onClick={(e) => {
                                      setRateModal(true);
                                      setOrderID(id);
                                    }}
                                    startIcon={
                                      <StarBorderOutlined color="primary" />
                                    }
                                  >
                                    {t("rate")}
                                  </Button>

                                  {/* SET PRODUCT RATING */}
                                  <Button
                                    key={index}
                                    variant="outlined"
                                    color="info"
                                    onClick={(e) => {
                                      setProductRateModal(true);
                                      setProductID(order_items[0]?.product_id);
                                    }}
                                    startIcon={
                                      <StarBorderOutlined color="primary" />
                                    }
                                  >
                                    {t("rate_product")}
                                  </Button>

                                  {/* SET RIDER RATING */}
                                  <Button
                                    key={index}
                                    variant="outlined"
                                    color="info"
                                    onClick={(e) => {
                                      setRiderRateModal(true);
                                      setRiderID(order.rider_id);
                                    }}
                                    startIcon={
                                      <StarBorderOutlined color="primary" />
                                    }
                                  >
                                    {t("rate_rider")}
                                  </Button>
                                </Box>
                              ) : null}
                            </Box>
                          </div>
                        </div>
                      );
                    })}

                    <div className="pagination">
                      <Pagination
                        count={page}
                        color="error"
                        variant="outlined"
                        shape="rounded"
                        onChange={handlePageChange}
                        page={currentPage}
                      />
                    </div>

                    {rateModal === true ? (
                      <RateOrder
                        order={orderID}
                        rateModal={rateModal}
                        setRateModal={setRateModal}
                      />
                    ) : (
                      ""
                    )}

                    {productRateModal === true ? (
                      <RateProduct
                        product_id={productID}
                        rateModal={productRateModal}
                        setRateModal={setProductRateModal}
                      />
                    ) : (
                      ""
                    )}

                    {riderRateModal === true ? (
                      <RateRider
                        rider_id={riderID}
                        rateModal={riderRateModal}
                        setRateModal={setRiderRateModal}
                      />
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  <>
                    <Nofound />
                  </>
                )}
              </Box>
            </>
          )}
        </>
      ) : (
        <Box mt={-25}>
          {" "}
          <ApiErrorPage onRetry={Orders} />
        </Box>
      )}
    </>
  );
};

export default OrderListing;
