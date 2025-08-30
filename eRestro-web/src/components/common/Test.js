import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Logout from "@mui/icons-material/Logout";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { auth, firebase } from "../../utils/firebase";
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
import * as api from "../../utils/api";
import { t } from "i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useProfile } from "../../context/ProfileContext";
import { useCart } from "../../context/CartContext";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

const MySwal = withReactContent(Swal);

const Login = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [LoginOpen, setLoginOpen] = useState(false);
  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const [newUserscreen, setNewUserScreen] = useState(false);
  const [userId, setUserId] = useState("");
  const [isSend, setIsSend] = useState(false);
  const [load, setLoad] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneWithoutCountry, setPhoneWithoutCountry] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmResult, setConfirmResult] = useState("");
  const { setUserInfo } = useProfile();
  const [CartData, setCartData] = useState([]);
  const { get_cart } = useCart();
  const provider = new GoogleAuthProvider();
  const FacebookProvider = new FacebookAuthProvider();

  const [profile, setProfile] = useState({
    username: "",
    mobile: "",
    email: "",
    profile: "",
  });

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
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        // other options
      }
    );

    // return () => {
    //   window.recaptchaVerifier.render();
    // };
    // eslint-disable-next-line
  }, []);

  //validate regex
  const validatePhoneNumber = (phone_number) => {
    let regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/;
    return regexp.test(phone_number);
  };

  //sigin with number
  const onSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    let phone_number = "+" + phoneNumber;
    if (validatePhoneNumber(phone_number)) {
      const appVerifier = window.recaptchaVerifier;
      auth
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
  };

  //verify code

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setLoad(true);
    confirmResult
      .confirm(verificationCode)
      .then((response) => {
        setLoad(false);
        setProfile(response.user);
        if (response.additionalUserInfo.isNewUser) {
          setNewUserScreen(true);
        } else {
          api
            .userAuth(phoneWithoutCountry, "")
            .then((res) => {
              if (res.error) {
                toast.error(res.message);
              } else {
                let userData = res.data;
                userData = { ...userData, token: res.token };
                setUserDetails(userData);
                setUserId(res.uid);
                setUserInfo(userData);
                toast.success("Loggedin Successfully");
                handleLoginClose();
              }
            })
            .then(() => {
              const cart_data = localStorage.getItem("cart");
              api.cart_sync(cart_data).then((response) => {
                if (!response.error) {
                  setCartData(response.data);
                  localStorage.removeItem("cart");
                  get_cart();
                }
              });
            });
        }
      })
      .catch((error) => {
        setLoad(false);
        window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaVerifier.reset(widgetId);
        });
        toast.error(error.message);
      });
  };

  //resend otp
  const resendOtp = (e) => {
    e.preventDefault();
    setLoad(true);
    let phone_number = phoneNumber;
    const appVerifier = window.recaptchaVerifier;
    auth
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
      }
    });
  };

  //   sign in using google

  const googleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const userData = result.user;
        api
          .sign_up("google", userData.displayName, userData.email)
          .then((response) => {
            setProfile(response);
            let userData = response.data;
            userData = { ...userData, token: response.token };
            setUserDetails(userData);
            setUserId(response.uid);
            localStorage.setItem("user", JSON.stringify(userData));
            setUserInfo(response.data);
            handleLoginClose();
          })
          .catch((error) => {
            toast.error(error.message);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  //   sign in with facebook login

  const FacebookLogin = () => {
    signInWithPopup(auth, FacebookProvider)
      .then((result) => {
        const user = result.user;
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        console.log(user);
        api
          .sign_up("facebook", user.displayName, user.email)
          .then((response) => {
            setProfile(response);
            let userData = response.data;
            userData = { ...userData, token: response.token };
            setUserDetails(userData);
            setUserId(response.uid);
            localStorage.setItem("user", JSON.stringify(userData));
            setUserInfo(response.data);
            handleLoginClose();
          })
          .catch((error) => {
            toast.error(error.message);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
      });
  };

  return (
    <>
      {currentUser ? (
        <>
          <Tooltip title="Account settings">
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
                <Logout fontSize="small" />
              </ListItemIcon>
              {t("log_out")}
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
                    Hungry? Why to wait?{" "}
                    <Typography
                      component={"span"}
                      className="highlight"
                      sx={{ fontWeight: "bold" }}
                    >
                      Login
                    </Typography>{" "}
                    now.
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
                              {"Please Enter your mobile number"} :
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
                              className="mb-3 position-relative d-inline-block w-100 form-control mt20"
                            />
                            <div className="send-button mt-3 mb20 mt20">
                              <Button
                                variant="contained"
                                type="submit"
                                fullWidth
                              >
                                {!load ? "Request OTP" : t("please_wait")}
                              </Button>
                            </div>
                            <Divider>OR</Divider>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={(e) => googleLogin()}
                              className="mt20"
                              sx={{
                                textTransform: "capitalize",
                                backgroundColor: "#ff0000bf",
                              }}
                            >
                              <GoogleIcon
                                sx={{ marginRight: "10px", fontSize: "20px" }}
                              />{" "}
                              Sign In With Google
                            </Button>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={(e) => FacebookLogin()}
                              className="mt20"
                              sx={{ textTransform: "capitalize" }}
                            >
                              <FacebookIcon
                                sx={{ marginRight: "10px", fontSize: "25px" }}
                              />
                              Sign In With Facebook
                            </Button>
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
                              label={"Enter your OTP"}
                              type="text"
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
                                  {"Resend OTP"}
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
                                  {!load ? "Submit" : t("please_wait")}
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
                                  {"Back"}
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
                  Signup
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
                        defaultValue={profile.username}
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
                          Register
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
