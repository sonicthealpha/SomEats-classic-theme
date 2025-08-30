import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Logout from "@mui/icons-material/Logout";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import firebaseconfig from "../../utils/firebase";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Typography,
  Modal,
  Box,
  TextField,
  Divider,
  Avatar,
  Tooltip,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";
import config from "../../utils/config";
import { t } from "i18next";
import * as api from "../../utils/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useProfile } from "../../context/ProfileContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { selectData } from "../../store/reducers/settings";
import { useSelector } from "react-redux";

const MySwal = withReactContent(Swal);

const Login = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [LoginOpen, setLoginOpen] = useState(false);
  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const [newUserscreen, setNewUserScreen] = useState(false);
  // eslint-disable-next-line
  const demoMOde = process.env.REACT_APP_DEMO_MODE || "true";
  const [userId, setUserId] = useState("");
  const [isSend, setIsSend] = useState(false);
  const [load, setLoad] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    demoMOde === "true" ? "919876543210" : ""
  );
  const [phoneWithoutCountry, setPhoneWithoutCountry] = useState(
    demoMOde === "true" ? "9876543210" : ""
  );
  const [verificationCode, setVerificationCode] = useState(
    demoMOde === "true" ? "123456" : ""
  );
  const [confirmResult, setConfirmResult] = useState("");
  const { setUserInfo } = useProfile();
  // eslint-disable-next-line
  const [CartData, setCartData] = useState([]);
  const { get_cart } = useCart();

  const [profile, setProfile] = useState({
    username: "",
    mobile: "",
    email: "",
    profile: "",
  });

  const navigate = useNavigate();

  let firebase = firebaseconfig();

  const authentication_mode = useSelector(selectData)?.authentication_mode;

  //user set
  const { setUserDetails } = useAuth();

  //handle signout
  const { signOut } = useAuth();

  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //user selector
  const { currentUser } = useAuth();

  //recaptcha verifier
  useEffect(() => {
    window.recaptchaVerifier = new firebase.firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        // other options
      }
    );

    // return () => {
    //   window.recaptchaVerifier.clear();
    // };
    // eslint-disable-next-line
  }, []);

  //validate regex
  const validatePhoneNumber = (phone_number) => {
    let regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    return regexp.test(phone_number);
  };

  //sign with number
  const onSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    if (authentication_mode === 1) {
      let phone_number = "+" + phoneNumber;
      if (validatePhoneNumber(phone_number)) {
        api
          .verify_user(phoneWithoutCountry)
          .then((response) => {
            setIsSend(true);
            setLoad(false);
            setConfirmResult(response);
            toast.success("OTP has been sent");
          })
          .catch((error) => {
            window.recaptchaVerifier.render().then(function (widgetId) {
              window.recaptchaVerifier.reset(widgetId);
            });
            toast.error(error.message);
            setLoad(false);
          });
      } else {
        setLoad(false);
        toast.error("Please Enter correct Mobile Number with Country Code");
      }
    } else {
      let phone_number = "+" + phoneNumber;
      if (validatePhoneNumber(phone_number)) {
        const appVerifier = window.recaptchaVerifier;

        firebase.auth
          .signInWithPhoneNumber(phone_number, appVerifier)
          .then((response) => {
            setIsSend(true);
            setLoad(false);
            setConfirmResult(response);
          })
          .catch((error) => {
            window.recaptchaVerifier.render().then(function (widgetId) {
              window.recaptchaVerifier.reset(widgetId);
            });
            toast.error(error.message);
            setLoad(false);
          });
      } else {
        setLoad(false);
        toast.error("Please Enter correct Mobile Number with Country Code");
      }
    }
  };

  const cart_data = localStorage.getItem("cart");
  const cart = JSON.parse(cart_data);
  //   console.log(cart);

  //verify code
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setLoad(true);
    if (authentication_mode === 1) {
      api
        .verify_otp({ phoneWithoutCountry, verificationCode })
        .then((response) => {
          setLoad(false);
          setProfile(response?.user);
          if (!response.error) {
            api.userAuth(parseInt(phoneWithoutCountry), "").then((res) => {
              if (res.data.length === 0) {
                toast.error(res.message);
                setNewUserScreen(true);
              } else {
                let userData = res.data;
                userData = { ...userData, token: res.token };
                setUserDetails(userData);
                setUserId(res.uid);
                setUserInfo(userData);
                console.log(res.data.id);

                const cart_data = localStorage.getItem("cart");
                const cart = JSON.parse(cart_data);
                console.log(cart);
                console.log(res.data.id);
                if (cart !== null) {
                  api
                    .manage_cart(
                      res.data.id,
                      cart[0].product_variant_id,
                      "",
                      "",
                      cart[0].qty,
                      "",
                      ""
                    )
                    .then((response) => {
                      if (!response.error) {
                        setCartData(response.data);
                        localStorage.removeItem("cart");
                        get_cart();
                      }
                    });
                }

                toast.success("Logged in Successfully");
                handleLoginClose();

                setTimeout(function () {
                  window.location.reload();
                }, 1000); // 1000 milliseconds = 1 seconds
              }
            });
          } else {
            toast.error(response.message);
          }
          // .then((response) => {
          //   window.location.reload();
          // });
        });
    } else {
      confirmResult
        .confirm(verificationCode)
        .then((response) => {
          setLoad(false);
          setProfile(response.user);
          if (response.additionalUserInfo.isNewUser) {
            setNewUserScreen(true);
          } else {
            api
              .userAuth(parseInt(phoneWithoutCountry), "")
              .then((res) => {
                if (res.error) {
                  toast.error(res.message);
                } else {
                  let userData = res.data;
                  userData = { ...userData, token: res.token };
                  setUserDetails(userData);
                  setUserId(res.uid);
                  setUserInfo(userData);
                  console.log(res.data.id);

                  const cart_data = localStorage.getItem("cart");
                  const cart = JSON.parse(cart_data);
                  console.log(cart);
                  console.log(res.data.id);
                  if (cart !== null) {
                    api
                      .manage_cart(
                        res.data.id,
                        cart[0].product_variant_id,
                        "",
                        "",
                        cart[0].qty,
                        "",
                        ""
                      )
                      .then((response) => {
                        if (!response.error) {
                          setCartData(response.data);
                          localStorage.removeItem("cart");
                          get_cart();
                        }
                      });
                  }

                  toast.success("Logged in Successfully");
                  handleLoginClose();
                }
              })
              .then((response) => {
                window.location.reload();
              });
          }
        })
        .catch((error) => {
          setLoad(false);
          try {
            window.recaptchaVerifier.render().then((widgetId) => {
              try {
                window.recaptchaVerifier.reset(widgetId);
              } catch (error) {
                console.log(error);
              }
            });
          } catch (error) {
            console.log(error);
          }
          toast.error(error.message);
        });
    }
  };

  //resend otp
  const resendOtp = (e) => {
    e.preventDefault();
    setLoad(true);
    if (authentication_mode === 1) {
      let phone_number = "+" + phoneNumber;
      if (validatePhoneNumber(phone_number)) {
        api
          .resend_otp(phoneWithoutCountry)
          .then((response) => {
            setIsSend(true);
            setLoad(false);
            setConfirmResult(response);
            toast.success("OTP has been sent");
          })
          .catch((error) => {
            window.recaptchaVerifier.render().then(function (widgetId) {
              window.recaptchaVerifier.reset(widgetId);
            });
            toast.error(error.message);
            setLoad(false);
          });
      } else {
        setLoad(false);
        toast.error("Please Enter correct Mobile Number with Country Code");
      }
    } else {
      let phone_number = "+" + phoneNumber;
      const appVerifier = window.recaptchaVerifier;
      firebase.auth
        .signInWithPhoneNumber(phone_number, appVerifier)
        .then((response) => {
          setIsSend(true);
          setLoad(false);
          setConfirmResult(response);
          toast.success("OTP has been sent");
        })
        .catch((error) => {
          window.recaptchaVerifier.render().then(function (widgetId) {
            window.recaptchaVerifier.reset(widgetId);
          });
          toast.error(error.message);
          setLoad(false);
        });
    }
  };

  const handleKeyPress = (event) => {
    //console.log("Key pressed:", event.key);
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit(event);
    }
  };

  //signup screen form
  const formSubmit = async (e) => {
    e.preventDefault();
    let username = profile.username;
    let email = profile.email;
    let country_code = profile.country_code;
    let fcm_id = profile.fcm_id;
    api
      .register_user(
        username,
        email,
        phoneWithoutCountry,
        country_code,
        "",
        fcm_id
      )
      .then((response) => {
        if (response.error) {
          toast.error(response.message);
        } else {
          setProfile(response);
          let userData = response.data;
          userData = { ...userData, token: response.token };
          setUserDetails(userData);
          setUserId(response.uid);
          toast.success("Successfully Register");
          localStorage.setItem("user", JSON.stringify(userData));
          setUserInfo(response.data);
          handleLoginClose();
          setTimeout(function () {
            window.location.reload();
          }, 1500); // 1000 milliseconds = 1 seconds
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const onChangePhoneNumber = (e) => {
    e.preventDefault();
    setVerificationCode("");
    setConfirmResult(null);
    setIsSend(false);
  };

  const handleChange = (e) => {
    const field_name = e.target.name;
    const field_value = e.target.value;
    setProfile((values) => ({ ...values, [field_name]: field_value }));
  };

  //signout

  const handleSignout = () => {
    MySwal.fire({
      title: "logout",
      text: "Are you sure",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut();
        setUserInfo("");
        navigate("/");
      }
    });
  };

  return (
    <>
      {currentUser ? (
        <>
          <Tooltip title={t("account_settings")}>
            <IconButton
              onClick={handleClickMenu}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }} src="/broken-image.jpg" />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            component="h6"
            sx={{ margin: "auto", cursor: "pointer" }}
          ></Typography>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Link to="/account">
              <MenuItem>{t("my_profile")}</MenuItem>
            </Link>
            <Divider />
            <MenuItem onClick={handleSignout}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: "red" }} />
              </ListItemIcon>
              <Typography
                variant="inherit"
                sx={{ color: "red", fontWeight: 500, marginLeft: -1 }}
              >
                {t("log_out")}
              </Typography>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Typography
            variant="subtitle1"
            component="h6"
            sx={{ margin: "auto", cursor: "pointer" }}
            onClick={handleLoginOpen}
          >
            {t("log_in")}
          </Typography>
        </>
      )}

      <Modal
        open={LoginOpen}
        onClose={handleLoginClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="login-model">
          {!newUserscreen ? (
            <div className="container">
              <div className="row morphisam">
                <div className="inner__login__form outerline">
                  <Typography
                    component={"h2"}
                    className="mb-4 text-uppercase"
                    sx={{ fontWeight: 500 }}
                  >
                    {t("hungry_why_to_wait")}{" "}
                    <Typography
                      component={"span"}
                      className="highlight"
                      sx={{ fontWeight: "bold" }}
                    >
                      {t("login")}
                    </Typography>{" "}
                    {t("now")}.
                  </Typography>
                  <div className="border" />
                  <Grid container spacing={8}>
                    <Grid item md={4}>
                      <div className="login-image">
                        <img
                          src={
                            process.env.PUBLIC_URL + "/images/crispy-mixed.png"
                          }
                          alt="login"
                        />
                      </div>
                    </Grid>
                    <Grid item md={8} className="login-col">
                      {!isSend ? (
                        <form
                          className="form text-start mt20 mb20"
                          onSubmit={onSubmit}
                        >
                          <div>
                            <label htmlFor="number" className="text-white mb-3">
                              {t("please_enter_your_mobile_number")} :
                            </label>

                            <PhoneInput
                              value={phoneNumber}
                              country={config.DefaultCountrySelectedInMobile}
                              countryCodeEditable={false}
                              autoFocus={true}
                              onChange={(value, data) => {
                                setPhoneWithoutCountry(
                                  value.slice(data.dialCode.length)
                                );
                                setPhoneNumber(value);
                              }}
                              onKeyDown={(event) => handleKeyPress(event)} // Add keypress event handler
                              className="mb-3 position-relative d-inline-block w-100 form-control mt20"
                            />
                            <div className="send-button mt-3 mb20 mt20">
                              <Button
                                variant="contained"
                                type="submit"
                                fullWidth
                              >
                                {!load ? t("request_otp") : t("please_wait")}
                              </Button>
                            </div>
                          </div>
                        </form>
                      ) : null}
                      {isSend ? (
                        <form
                          className="form text-start mt20"
                          onSubmit={handleVerifyCode}
                        >
                          <div className="form">
                            <TextField
                              color="error"
                              id="outlined-number"
                              fullWidth
                              label={t("enter_your_otp")}
                              type="text"
                              value={verificationCode}
                              onChange={(e) =>
                                setVerificationCode(e.target.value)
                              }
                              className="form-control p-3"
                            />
                            <div className="text-end">
                              <Button variant="text" sx={{ color: "#fff" }}>
                                <Link
                                  className="main-color"
                                  to="#"
                                  onClick={resendOtp}
                                >
                                  {t("resend_otp")}
                                </Link>
                              </Button>
                            </div>
                            <Stack
                              spacing={2}
                              direction="row"
                              sx={{ justifyContent: "space-between" }}
                            >
                              <div className="verify-code send-button">
                                <Button
                                  variant="contained"
                                  type="submit"
                                  className="mt20 mb20"
                                >
                                  {!load ? t("submit") : t("please_wait")}
                                </Button>
                              </div>
                              <div className="back-button">
                                <Button
                                  variant="outlined"
                                  className="mt20 mb20 "
                                  onClick={onChangePhoneNumber}
                                  color="error"
                                  sx={{ color: "#fff", borderColor: "#fff" }}
                                >
                                  {t("back")}
                                </Button>
                              </div>
                            </Stack>
                          </div>
                        </form>
                      ) : null}
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          ) : (
            <div className="Profile__Sec">
              <div className="row morphism p-5">
                <Typography
                  component={"h2"}
                  className="mb-4 text-uppercase mb20"
                  sx={{ fontWeight: 500, color: "#fff" }}
                >
                  {t("Signup")}
                </Typography>
                <div className="border mb20" />
                <form onSubmit={formSubmit}>
                  <div className="row">
                    <div className="card p-4 bottom__card_sec">
                      <TextField
                        fullWidth
                        required
                        id="fullName"
                        label="Username"
                        name="username"
                        color="error"
                        className="mb20"
                        placeholder={"Enter Your Name"}
                        defaultValue={profile?.username}
                        onChange={handleChange}
                      />
                      <TextField
                        fullWidth
                        required
                        id="emailid"
                        label="email"
                        name="email"
                        color="error"
                        className="mb20"
                        placeholder={"Enter your email"}
                        onChange={handleChange}
                      />
                      <TextField
                        fullWidth
                        required
                        value={phoneWithoutCountry}
                        id="mobileid"
                        label="mobile"
                        color="error"
                        className="mb20"
                        placeholder={"Enter your Mobile no"}
                        onChange={handleChange}
                      />

                      <div className="send-button">
                        <Button variant="contained" type="submit" fullWidth>
                          {t("register")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Box>
      </Modal>
      <div id="recaptcha-container"></div>
    </>
  );
};

export default Login;
