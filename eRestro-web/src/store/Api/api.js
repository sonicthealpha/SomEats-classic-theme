import axios from "axios";
import { toast } from "react-hot-toast";
import * as actions from "../actions/apiActions";
/**
 *
 * @params
 * url :
 * method : GET / POST / PUT / DELETE
 * data : object
 * onStart : Redux action creator
 * onSuccess : Redux action creator
 * onError : Redux action creator
 * headers : object
 * displayToast : true / false, default : true
 * authorizationHeader : true / false , default : true --> if Authorisation Header should be set in request or not
 */

const api =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    // Check if Dispatched action is apiCallBegan then proceed with middleware code
    // If not then call the next and ignore this middleware
    if (action.type !== actions.apiCallBegan.type) return next(action);

    let {
      url,
      method,
      data,
      params,
      onStart,
      onSuccess,
      onError,
      onStartDispatch,
      onErrorDispatch,
      onSuccessDispatch,
      headers,
      displayToast,
      authorizationHeader,
    } = action.payload;
    if (typeof displayToast === "undefined") displayToast = true;

    if (
      typeof authorizationHeader === "undefined" ||
      authorizationHeader === true
    ) {
      // Check if token is expired
      const token = getState().user.token;
      if (token) {
        const decodedToken = parseJwt(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token expired, handle the logout process here
          handleLogout();
          return;
        }
        headers = {
          ...headers,
          Authorization: "Bearer " + token,
        };
      }
    }

    if (onStartDispatch) dispatch({ type: onStartDispatch });
    if (onStart) onStart();
    next(action);

    try {
      const response = await axios.request({
        baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/app/v1/api/",
        url,
        method,
        data,
        params,
        headers,
      });

      if (response.data.error) {
        dispatch(actions.apiCallFailed(response.data.message));
        if (onError) onError(response.data.message);
        if (onErrorDispatch)
          dispatch({ type: onErrorDispatch, payload: response.data.message });

        if (displayToast) {
          toast.error(response.data.message);
        }
      } else {
        dispatch(actions.apiCallSuccess(response.data));
        if (onSuccess) onSuccess(response.data);
        if (onSuccessDispatch)
          dispatch({ type: onSuccessDispatch, payload: response.data });

        if (displayToast) {
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
        return;
      }

      dispatch(actions.apiCallFailed(error.message));
      if (onError) onError(error.message);
      if (onErrorDispatch)
        dispatch({ type: onErrorDispatch, payload: error.message });

      if (displayToast) {
        toast.error(error.message);
      }
    }
  };

// Function to parse JWT token
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// Function to handle logout process
const handleLogout = () => {
  localStorage.clear();
  window.location.href = "/";
  localStorage.removeItem("user");
};

export default api;
