import { isLogin } from "../utils/functions";

const PublicRoutes = ({children}) => {
  let user = isLogin();
  if (user) {
    return children;
  }
  return children;
};

export default PublicRoutes;
