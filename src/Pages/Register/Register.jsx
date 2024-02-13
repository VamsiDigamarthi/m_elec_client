import React, { useState } from "react";
import "./Register.css";
import SignUp from "../SignUp/SignUp";
import Login from "../Login/Login";

const Register = () => {
  const [switchRegisterPage, setSwitchRegisterPage] = useState(0);

  return (
    <div className="register__main__card">
      <div className="sigup__inner__card">
        <div
          className="signup__left__side"
          style={{
            flex: switchRegisterPage === 1 && "1.5",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="signup__text__card">
              <span className="signup__welcome__text">Welcome</span>
              <span>Register new account</span>
            </div>

            <div className="signup__tabs__card">
              <span onClick={() => setSwitchRegisterPage(0)}>Sign Up</span>
              <span onClick={() => setSwitchRegisterPage(1)}>Log In</span>
            </div>
          </div>
          {/* tabs carsd */}
          {switchRegisterPage === 0 ? <SignUp /> : <Login />}
        </div>
        {/* image card */}

        <div className="signup__image__card">
          <img src="Images/cam-signup.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Register;
