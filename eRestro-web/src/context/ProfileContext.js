import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import * as api from "../utils/api";

const Profile = createContext();

export function useProfile() {
  return useContext(Profile);
}

export function ProfileContext({ children }) {
  const [UserInfo, setUserInfo] = useState([]);

  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    setUserInfo(userData);
    // eslint-disable-next-line
  }, []);

  const editProfile = (username, mobile, email) => {
    api
      .update_user(username, mobile, email)
      .then((response) => {
        if (response.error) {
          toast.error(response.message);
        } else {
          toast.success("Update user successfully..!");
          let data = JSON.parse(localStorage.getItem("user"));
          const user = {
            ...data,
            username: username,
          };
          localStorage.setItem("user", JSON.stringify(user));
          setUserInfo(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const value = {
    editProfile,
    UserInfo,
    setUserInfo,
  };

  return <Profile.Provider value={value}>{children}</Profile.Provider>;
}
