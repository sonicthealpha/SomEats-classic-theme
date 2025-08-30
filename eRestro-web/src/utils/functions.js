import config from "./config";

//is login
export function isLogin() {
  let user = localStorage.getItem("user");
  if (user) {
    try {
      user = JSON.parse(user);
      if (user.token) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
}

//logout
export function logout() {
  localStorage.clear();
  localStorage.removeItem("user");
  return true;
}

//get user data
export function getUserData() {
  let user = localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }
  return false;
}

// Add Script
export function loadAsyncScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    Object.assign(script, {
      type: "text/javascript",
      async: true,
      src,
    });
    script.addEventListener("load", () => resolve(script));
    document.head.appendChild(script);
  });
}

const mapApiJs = "https://maps.googleapis.com/maps/api/js";
const apiKey = config.YOUR_GOOGLE_MAPS_API_KEY;

export const initMapScript = () => {
  if (window.google) {
    return Promise.resolve();
  }
  const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
  return loadAsyncScript(src);
};

const payStackSrc = "https://js.paystack.co/v1/inline.js";
export const payStackInit = () => {
  return loadAsyncScript(payStackSrc);
};

export const extractAddress = (place) => {
  const address = {
    city: "",
    state: "",
    // zip: "",
    country: "",
    plain() {
      const city = this.city ? this.city + ", " : "";
      const state = this.state ? this.state + ", " : "";
      return city + state + this.country;
    },
  };

  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach((component) => {
    const types = component.types;
    const value = component.long_name;

    if (types.includes("locality")) {
      address.city = value;
    }

    if (types.includes("administrative_area_level_2")) {
      address.state = value;
    }

    if (types.includes("country")) {
      address.country = value;
    }
  });

  return address;
};

export const lat_long = (key, value) => {
  localStorage.setItem(key, value);
};

export const createOrderId = (userId) => {
  const currentTime = new Date();
  const timeInMilliseconds = currentTime.getTime();
  const orderId = `${userId}_${timeInMilliseconds}`;
  return orderId;
};
