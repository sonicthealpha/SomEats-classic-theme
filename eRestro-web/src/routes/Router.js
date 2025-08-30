import React from "react";
import { Route, Routes } from "react-router";
import Privacy from "../pages/Privacy";
import TermsConditions from "../pages/TermsConditions";
import Invoice from "../pages/Invoice";
import Favorites from "../components/common/Favorites";
import PublicRoutes from "../routes/PublicRoutes";
import PrivateRoutes from "../routes/PrivateRoutes";
import ContactUs from "../pages/ContactUs";
import RestaurantsByCategory from "../pages/RestaurantsByCategory";
import { lazy } from "react";
import OrderPlaced from "../pages/OrderPlaced";

const Home = lazy(() => import("../../src/pages/Home"));
const RestaurantsListing = lazy(() =>
  import("../../src/pages/RestaurantsListing")
);
const CategoryListing = lazy(() => import("../../src/pages/CategoryListing"));
const RestaurantsDetails = lazy(() =>
  import("../../src/pages/RestaurantsDetails")
);
const OrderListing = lazy(() => import("../../src/pages/OrderListing"));
const Account = lazy(() => import("../../src/pages/Account"));
const CardContent = lazy(() => import("../../src/components/cart/CartContent"));
const Test = lazy(() => import("../../src/pages/Test"));

const Router = () => {
  return (
    <Routes>
      <Route
        path="/test"
        exact
        element={
          <PublicRoutes>
            <Test />
          </PublicRoutes>
        }
      />
      <Route
        path="/"
        exact
        element={
          <PublicRoutes>
            <Home />
          </PublicRoutes>
        }
      />
      <Route
        path="/restaurants"
        exact
        element={
          <PublicRoutes>
            <RestaurantsListing />
          </PublicRoutes>
        }
      />
      <Route
        path="/categories"
        exact
        element={
          <PublicRoutes>
            <CategoryListing />
          </PublicRoutes>
        }
      />
      <Route
        path="/restaurant/:slug"
        exact
        element={
          <PublicRoutes>
            <RestaurantsDetails />
          </PublicRoutes>
        }
      />
      <Route
        path="/orderlist"
        exact
        element={
          <PrivateRoutes>
            <OrderListing />
          </PrivateRoutes>
        }
      />
      <Route
        path="/account"
        exact
        element={
          <PrivateRoutes>
            <Account />
          </PrivateRoutes>
        }
      />
      <Route
        path="/cart"
        exact
        element={
          <PublicRoutes>
            <CardContent />
          </PublicRoutes>
        }
      />
      <Route
        path="/privacy"
        exact
        element={
          <PublicRoutes>
            <Privacy />
          </PublicRoutes>
        }
      />
      <Route
        path="/terms-conditions"
        exact
        element={
          <PublicRoutes>
            <TermsConditions />
          </PublicRoutes>
        }
      />
      <Route
        path="/invoice"
        exact
        element={
          <PublicRoutes>
            <Invoice />
          </PublicRoutes>
        }
      />
      <Route
        path="/favorites"
        exact
        element={
          <PrivateRoutes>
            <Favorites />
          </PrivateRoutes>
        }
      />
      <Route
        path="/contact-us"
        exact
        element={
          <PublicRoutes>
            <ContactUs />
          </PublicRoutes>
        }
      />
      <Route
        path="/categories/:slug"
        exact
        element={
          <PublicRoutes>
            <RestaurantsByCategory />
          </PublicRoutes>
        }
      />
      <Route
        path="/confirmed"
        exact
        element={
          <PublicRoutes>
            <OrderPlaced />
          </PublicRoutes>
        }
      />
    </Routes>
  );
};

export default Router;
