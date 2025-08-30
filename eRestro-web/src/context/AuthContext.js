import { useContext, useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

AuthProvider.propTypes = {
  children: PropTypes.object
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState();

  const setUserDetails = (userDetails) => {
    localStorage.setItem("user", JSON.stringify(userDetails));
    setCurrentUser(userDetails);
  };

  //signout
  const signOut = async () => {
    setCurrentUser(null);
    localStorage.clear();
  };

  useEffect(() => {
    setLoading(false);
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser && loggedInUser != undefined) {
      try {
        const foundUser = JSON.parse(loggedInUser);
        setCurrentUser(foundUser);
      } catch (e) {}
    }
    // eslint-disable-next-line
  }, []);

  const value = {
    currentUser,
    setUserDetails,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
