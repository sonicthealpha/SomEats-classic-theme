import React from "react";
import { Navigate } from "react-router-dom";
import { isLogin } from "../utils/functions";

const PrivateRoutes = ({ children}) => {
  let user = isLogin();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoutes;