import React from "react";
import Translate from "./pages/Translate";
//import History from "./pages/history/History";
import BadWordHistory from "./pages/BadWordHistory";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import SavedWords from "./pages/savedWord/SavedWord";
import { Checkout } from "./pages/checkout/Checkout";
import Login from "./pages/login/Login";
import Registration from "./pages/registration/Registration";
import FeedbackTable from "./pages/feedback/FedbackTable";
import MemberShipPlan from "./pages/membershipPlans/MemberShipPlan";

import MembershipControlPanel from "./pages/membershipPlans/MembershipControlPanel";
import CreateNewMemberShip from "./pages/membershipPlans/CreateNewMemberShip";
import CheckoutPage from "./pages/checkout/Checkout";
import ControlPanel from "./pages/admin/ControlPanel";
import UpdateMemberShip from "./pages/admin/UpdateMembership";
import { useEffect, useState } from "react";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      fetch(`${backendUrl}/auth/login/success`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Translate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feedback" element={<FeedbackTable />} />
        <Route path="/register" element={<Registration />} />
        {/* <Route path="/saved" element={<TranslationSaved/>}/>
        <Route path="/history" element={<TranslationHistory/>}/> */}
        <Route path="/BadWord" element={<BadWordHistory />} />
        {/* <Route path="/checkout" element={<Checkout/>}/>       */}
        <Route path="/memberships" element={<MemberShipPlan />} />
        <Route
          path="/membership-control-panel"
          element={<MembershipControlPanel />}
        />
        <Route path="/create-membership" element={<CreateNewMemberShip />} />

        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/adminController" element={<ControlPanel />} />
        <Route path="/update-member/:id" element={<UpdateMemberShip />} />
      </Routes>
    </Router>
  );
};

export default App;
