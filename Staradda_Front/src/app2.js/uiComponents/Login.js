import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Rightcontainer from "../Components/Rightcontainer";
import "../css/layout.css";
import "../css/login.css";
import loginss from "./ss.png";
import { MdCall } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
export default function Login() {
  const history = useHistory();
  const [Phone, setPhone] = useState();
  const [twofactor_code, settwofactor_code] = useState();
  const [otp, setOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [secretCode, setSecretCode] = useState();
  let refs = useLocation().pathname.split("/")[2];
  const [referral, setReferral] = useState(refs);

  const EndPoint = process.env.REACT_APP_API_URL;

  // console.log(referral)
  const handleClick = async (e) => {
    e.preventDefault();

    if (!Phone) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your phone number",
      });
    } else if (Phone.length != 10) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please  enter currect phone number",
      });
    } else {
      setLoading(true);
      await axios
        .post(`${EndPoint}/login`, {
          Phone,
          referral,
        })
        .then((respone) => {
          setLoading(false);
          if (respone.data.status == 101) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: respone.data.msg,
            });
          } else if (respone.data.status == 200) {
            setOtp(true);
            // console.log(respone.data)
            setSecretCode(respone.data.secret);
            if (respone.data.myToken) {
              Swal.fire({
                icon: "success",
                title: "OTP",
                text:
                  "OTP Send Successfully on: " +
                  respone.data?.myToken?.MessageData[0]?.Number,
              });
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong",
            // width: '20%',
            // height:'20%',
          });
        });
    }
  };

  const varifyOtp = async (e) => {
    e.preventDefault();
    // console.log('verify otp sumbut req')
    if (!Phone) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your phone number",
      });
    } else {
      await axios
        .post(`${EndPoint}/login/finish`, {
          Phone,
          twofactor_code,
          referral,
          secretCode,
        })
        .then((respone) => {
          if (respone.data.status == 101) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: respone.data.msg,
            });
          } else if (respone.data.status == 200) {
            const token = respone.data.token;
            localStorage.setItem("token", token);
            window.location.reload(true);
            setTimeout(function () {
              history.push("/Games");
            }, 1000);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    }
  };

  const setError = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Invalid Number",
      confirmation: true,
    });
  };

  const changeNumber = () => {
    setOtp(false);
  };
  // OTP VALID

  // otp valid
  const [isValid, setIsValid] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    let timerInterval;

    if (isValid && seconds > 0) {
      timerInterval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      clearInterval(timerInterval);
      setShowResend(true); // Show the Resend button when OTP expires
      setIsValid(false);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [isValid, seconds]);

  const handleResendClick = (e) => {
    handleClick(e);
    setIsValid(true);
    setSeconds(60);
    setShowResend(false); // Hide the Resend button after clicking it
  };

  return (
    <>
      <div
        className="leftContainer login_bg_main"
        style={{ minHeight: "100vh" }}
      >
        <div className="main-area bg-dark">
          <div style={{ overflowY: "hidden" }}>
            <div className="splash-overlay" />
            <div className="splash-screen animate__bounce infinite ">
              {/* <figure>
                <img width="100%" src={loginss} alt="" />
              </figure> */}
            </div>
            <div className=" center-xy mx-auto login_box">
              <div className="d-flex  login_heading">Sign in</div>

              {!otp && (
                <div
                  className=" px-3 cxy flex-column"
                  style={{
                    width: "95%",
                    height: "60px",
                    borderRadius: "5px",
                  }}
                >
                  <label>Mobile Number</label>
                  <div
                    className="input-group mb-2 "
                    style={{ transition: "top 0.5s ease 0s", top: "5px" }}
                  >
                    <div className="input-group-prepend">
                      <div
                        className="input-group-text  country_code"
                        style={{
                          width: "50px",
                          backgroundColor: "#e9ecef",
                          border: "1px solid #d8d6de",
                        }}
                      >
                        {/* +91 */}
                        <MdCall style={{ fontSize: "20px" }} />
                      </div>
                    </div>
                    <input
                      className="form-control auth_input_box"
                      name="mobile"
                      type="tel"
                      // placeholder='Mobile number'
                      // onChange={(e) => setPhone(e.target.value)}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (e.target.value.length > 10) {
                          setError(true);
                        }
                      }}
                      style={{
                        transition: "all 3s ease-out 0s",
                        borderRadius: "4px",
                        padding: "20px",
                      }}
                    />
                    {/* <div className="invalid-feedback">Enter a valid mobile number</div> */}
                  </div>
                </div>
              )}
              {otp && (
                <>
                  <div className="change_number_btn">
                    <Link onClick={changeNumber}>
                      <BiArrowBack /> Change Number
                    </Link>
                  </div>
                  <div
                    className=" px-3 cxy flex-column"
                    style={{
                      width: "95%",
                      height: "60px",
                      borderRadius: "5px",
                      marginTop: "10px",
                    }}
                  >
                    <div
                      className="input-group mb-2"
                      style={{ transition: "top 0.5s ease 0s", top: "5px" }}
                    >
                      <div className="input-group-prepend">
                        <div
                          className="input-group-text country_code"
                          style={{
                            width: "50px",
                            backgroundColor: "#e9ecef",
                            border: "1px solid #d8d6de",
                          }}
                        >
                          OTP
                        </div>
                      </div>
                      <input
                        className="form-control auth_input_box"
                        name="password"
                        type="tel"
                        placeholder="Enter OTP"
                        onChange={(e) => settwofactor_code(e.target.value)}
                        style={{
                          transition: "all 3s ease-out 0s",
                          borderRadius: "4px",
                          border: "1px solid #d8d6de",
                        }}
                      />
                      {/* <div className="invalid-feedback">Enter a valid mobile number</div> */}
                    </div>
                  </div>

                  <div className="resend_otp_div">
                    {/* <h4>
                    {' '}
                    Valid OTP for <span> 60S</span>
                  </h4> */}
                    {isValid ? (
                      <p className="otp_expire">
                        OTP is valid for {seconds} seconds.
                      </p>
                    ) : seconds === 0 ? (
                      <div className="otp_expire">
                        {showResend && (
                          <button
                            onClick={handleResendClick}
                            disabled={loading}
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="otp_expire">
                        OTP is valid for {seconds} seconds.
                      </p>
                    )}
                  </div>
                </>
              )}
              <div className="login_message_box">
                <p>
                  By proceeding, you confirm your acceptance of our &nbsp;
                  <Link to="term-condition">Legal Terms</Link> and verify that
                  you are at least 18 years old
                </p>
              </div>
              {!otp && (
                <button
                  className="Login-button cxy mt-4"
                  disabled={loading}
                  onClick={(e) => {
                    handleClick(e);
                    setIsValid(true);
                  }}
                >
                  Get OTP
                </button>
              )}
              {otp && (
                <button
                  className="Login-button cxy mt-4"
                  onClick={(e) => varifyOtp(e)}
                >
                  Verify
                </button>
              )}
            </div>

            {/* <div className="login-footer">
              By continuing I agree that khelo Hub Pvt. Ltd. may store
              and process my data in accordance with the
              <Link to="/term-condition">Terms of Use</Link>,
              <Link to="/PrivacyPolicy">Privacy Policy</Link> and that I am 18
              years or older. I am not playing from Assam, Odisha, Nagaland,
              Sikkim, Meghalaya, Andhra Pradesh, or Telangana.
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
