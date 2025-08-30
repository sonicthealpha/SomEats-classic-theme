import {
  useContext,
  useState,
  useEffect,
  createContext,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";
import * as api from "../utils/api";
import { isLogin } from "../utils/functions";

const AddContext = createContext();

export function useAddress() {
  return useContext(AddContext);
}

export function AddressContext({ children }) {
  const [addresses, setAddress] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const [user, setUser] = useState({
    mobile: "",
    userAddress: "",
    area: "",
    landmark: "",
    city: "",
  });
  const { mobile, userAddress, area, landmark, city } = user;

  const get_address = () => {
    api
      .get_address()
      .then((response) => {
        setAddress(response.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isLogin() === true) {
      get_address();
    }
  }, []);

  //   add address

  const add_address = (address_type) => {
    api
      .add_address(
        mobile,
        userAddress,
        area,
        city,
        landmark,
        latitude,
        longitude,
        address_type
      )
      .then((response) => {
        if (response.error) {
          toast.error(response.message);
        } else {
          setAddress([...addresses, ...response.data]);
          toast.success("Address Added Successfully!");
          get_address();
        }
      });
  };

  //   edit address

  const EditAddress = (
    id,
    user_mobile,
    user_address,
    user_area,
    user_city,
    user_landmark
  ) => {
    api
      .update_address(
        id,
        user_mobile,
        user_address,
        user_area,
        user_city,
        user_landmark
      )
      .then((response) => {
        let updated_address = addresses.map((data) => {
          if (data.id == id) {
            return response.data[0];
          } else {
            return data;
          }
        });
        setAddress(updated_address);
        get_address();
      });
  };

  // delete address

  const DeleteData = useCallback((id) => {
    api.delete_address(id).then((response) => {
      if (!response.error) {
        setAddress((address_data) => {
          return address_data.filter((_, index) => index != id);
        });
        get_address();
        toast.error("Address Deleted Successfully!");
      }
    });
  }, []);

  //extract Address

  const extractAddress = (place) => {
    const address = {
      city: "",
      state: "",
      zip: "",
      country: "",
      plain() {
        const city_data = this.city ? this.city + ", " : "";
        const zip = this.zip ? this.zip + ", " : "";
        const state = this.state ? this.state + ", " : "";
        return city_data + zip + state + this.country;
      },
    };

    if (!Array.isArray(place?.address_components)) {
      return address;
    }

    place.address_components.forEach((component) => {
      const types = component.types;
      const long_value = component.long_name;

      if (types.includes("locality")) {
        address.city = long_value;
      }

      if (types.includes("administrative_area_level_2")) {
        address.state = long_value;
      }

      if (types.includes("postal_code")) {
        address.zip = long_value;
      }

      if (types.includes("country")) {
        address.country = long_value;
      }
    });
    return address;
  };

  const onMarkerDragEnd = (event) => {
    let geocoder = new window.google.maps.Geocoder();
    geocoder
      .geocode({
        latLng: event.latLng,
      })
      .then((res) => {
        console.log(res.results[0]);
        const extract_city = extractAddress(res.results[0]);
        const addresses = res.results[0].formatted_address,
          addarea = res.results[0].address_components[1].long_name,
          addcity = extract_city.city;
        setUser({
          userAddress: addresses ? addresses : "",
          city: addcity ? addcity : "",
          area: addarea ? addarea : "",
        });
      });
    setLatitude(event.latLng.lat());
    setLongitude(event.latLng.lng());
  };

  const value = {
    addresses,
    add_address,
    EditAddress,
    DeleteData,
    extractAddress,
    user,
    setUser,
    onMarkerDragEnd,
    city,
    landmark,
    area,
    mobile,
    userAddress,
  };
  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}
