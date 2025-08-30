import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast"; // Import Toaster from react-hot-toast
import { Suspense } from "react";
import "./App.css";
import "./assets/css/style.css";
import "./assets/js/custom";
import BeatLoader from "react-spinners/BeatLoader";
import Router from "./routes/Router";
import { loadpaymentsettings, loadsettings } from "./store/reducers/settings";
import { useSelector } from "react-redux";
import SideDrawer from "./components/Buttons/SideDrawer";

function App() {
  useEffect(() => {
    loadsettings("all");
    loadpaymentsettings("payment_method");
  }, []);

  const loading = useSelector((state) => state.settings.loading);

  return (
    <div className="App">
      {/* Use the Toaster component */}
      <Toaster position="top-right" />
      <SideDrawer />
      <Suspense
        fallback={
          <div className="loader">
            <BeatLoader className="inner_loader" />
          </div>
        }
      >
        {loading ? <Router /> : null}
      </Suspense>
    </div>
  );
}

export default App;
