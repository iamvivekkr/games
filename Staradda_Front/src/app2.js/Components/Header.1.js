import axios from "axios";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import css from "./Component-css/Nav.module.css";
import { BsPlus } from "react-icons/bs";
import { w3_close, w3_open } from "./Header";

export const Header = ({ user, loggedIn }) => {
  const history = useHistory();
  const EndPoint = process.env.REACT_APP_API_URL;

  let access_token = localStorage.getItem("token");

  const logout = () => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(`${EndPoint}/logout`, {
        headers: headers,
      })
      .then((res) => {
        localStorage.removeItem("token");
        window.location.reload();
        history.push("/login");
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          history.push("/login");
        }
      });
  };

  return (
    <div>
      {access_token ? (
        <React.Fragment>
          <div id="sidebarOverlay" onClick={w3_close}></div>
          <div
            className="w3-sidebar w3-bar-block"
            id="mySidebar"
            style={{ paddingBottom: "50px" }}
          >
            <Link
              to={"/Profile"}
              className="w3-bar-item w3-button"
              onClick={w3_close}
            >
              <picture className="icon">
                {user && user.avatar ? (
                  <img
                    width="30px"
                    height="30px"
                    src={`${EndPoint}/${user && user.avatar}`}
                    alt="profile"
                    style={{ borderRadius: "50px" }}
                  />
                ) : (
                  <img
                    src={process.env.PUBLIC_URL + "/images/icons/profile.png"}
                    width="30px"
                    height="30px"
                    alt="profile"
                  />
                )}
              </picture>
              <div style={{ marginLeft: ".5rem" }}>My Profile</div>
            </Link>
            <Link
              to={"/landing"}
              className="w3-bar-item w3-button"
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src={process.env.PUBLIC_URL + "/images/icons/cash.png"}
                />
              </picture>
              <div style={{ marginLeft: ".5rem" }}>Win cash</div>
            </Link>
            <Link
              to={"/wallet"}
              className="w3-bar-item w3-button"
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src={process.env.PUBLIC_URL + "/images/icons/wallet.png"}
                />
              </picture>
              <div style={{ marginLeft: ".5rem" }}>My wallet</div>
            </Link>

            <Link
              to={"/Gamehistory"}
              className="w3-bar-item w3-button"
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src={process.env.PUBLIC_URL + "/images/icons/history.png"}
                />
              </picture>
              <div style={{ marginLeft: ".5rem" }}>Game History</div>
            </Link>

            <Link
              to="/transaction-history"
              className="w3-bar-item w3-button"
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src={
                    process.env.PUBLIC_URL +
                    "/images/icons/transaction-history.png"
                  }
                />
              </picture>
              <div style={{ marginLeft: ".5rem" }}>Transaction History</div>
            </Link>

            <Link
              to={"/refer"}
              className="w3-bar-item w3-button"
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src={process.env.PUBLIC_URL + "/images/icons/refer.png"}
                />
              </picture>
              <div style={{ marginLeft: ".5rem" }}>Refer and Earn</div>
            </Link>

            <Link
              to={"/Referral-history"}
              className="w3-bar-item w3-button"
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src={
                    process.env.PUBLIC_URL + "/images/icons/refer-history.png"
                  }
                />
              </picture>
              <div style={{ marginLeft: ".5rem" }}>Refer History</div>
            </Link>

            <Link
              to={"/Notification"}
              className="w3-bar-item w3-button"
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src={
                    process.env.PUBLIC_URL + "/images/icons/notification.png"
                  }
                />
              </picture>
              <div style={{ marginLeft: ".5rem" }}>Notification</div>
            </Link>

            <Link
              to={"/support"}
              className="w3-bar-item w3-button"
              onClick={w3_close}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src={process.env.PUBLIC_URL + "/images/icons/support.png"}
                />
              </picture>
              <div style={{ marginLeft: ".5rem" }}>Support</div>
            </Link>
            <Link
              className="w3-bar-item w3-button"
              to="/"
              onClick={(e) => logout(e)}
            >
              <picture className="icon">
                <img
                  alt="img"
                  src={process.env.PUBLIC_URL + "/Images/logout.png"}
                />
              </picture>
              <div style={{ marginLeft: ".5rem" }}>Logout</div>
            </Link>
          </div>

          <div className="w3-teal">
            <div className="w3-container ">
              <div className={`${css.headerContainer} `}>
                <button
                  className="w3-button  w3-xlarge float-left hambergar_btn"
                  onClick={w3_open}
                  id="hambergar"
                >
                  <picture className={`${css.sideNavIcon} mr-0`}>
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/images/LandingPage_img/sidebar.png"
                      }
                      className="snip-img"
                      alt=""
                    />
                  </picture>
                </button>
                <Link to="/">
                  <picture className={`ml-2 ${css.navLogo} d-flex`}>
                    <img
                      src="/images/khelohublogo.png"
                      className="snip-img"
                      alt="logo"
                    />
                  </picture>
                </Link>
                <div>
                  <div className={`${css.menu_items}`}>
                    <Link className={`${css.box}`} to="/Addcase">
                      <picture className={`${css.moneyIcon_container}`}>
                        <img
                          src="/images/global-rupeeIcon.png"
                          className="snip-img"
                          style={{ marginRight: "5px" }}
                          alt=""
                        />
                        {/* <BsCash className='header_cash_btn' /> */}
                      </picture>
                      <div className="mt-1 ml-1">
                        <div className={`${css.moneyBox_header}`}>Cash</div>
                        <div className={`${css.moneyBox_text}`}>
                          <span style={{ marginRight: "4px" }}>₹</span>
                          {user && user.Wallet_balance}
                        </div>
                      </div>
                      <picture className={`${css.moneyBox_add}`}>
                        <BsPlus className="header_plus_icon" />
                      </picture>
                    </Link>
                    <Link
                      className={`${css.box} ml-2 orange_btn`}
                      to="/redeem/refer"
                      style={{ width: "80px" }}
                    >
                      <picture className={`${css.moneyIcon_container}`}>
                        <img
                          src="/images/LandingPage_img/collections.png"
                          className="snip-img"
                          style={{ marginRight: "5px" }}
                          alt=""
                        />
                      </picture>
                      <div className="mt-1 ml-1 ">
                        <div className={`${css.moneyBox_header}`}>Earning</div>
                        <div className={`${css.moneyBox_text}`}>
                          {user && user.referral_wallet}
                        </div>
                      </div>
                    </Link>
                    {/* <Link
                      className={`${css.box} ml-2 orange_btn`}
                      style={{ width: "80px" }}
                      onClick={() => localStorage.clear()}
                    >
                      <picture className={`${css.moneyIcon_container}`}>
                        <img
                          src="/images/LandingPage_img/collections.png"
                          className="snip-img"
                          style={{ marginRight: "5px" }}
                          alt=""
                        />
                      </picture>
                      <div className="mt-1 ml-1 ">
                        <div className={`${css.moneyBox_header}`}>Logout</div>
                      </div>
                    </Link> */}
                  </div>
                  <span className="mx-5"></span>
                </div>
                <span className="mx-5"></span>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className="w3-teal ">
          <div className="w3-container ">
            <div className={`${css.headerContainer} justify-content-between`}>
              <Link to="/">
                <picture className={`ml-2 ${css.navLogo} d-flex`}>
                  <img
                    src="/images/khelohublogo.png"
                    className="snip-img"
                    alt="logo"
                  />
                </picture>
              </Link>

              <div className={`ml-5`}>
                <Link type="button" className="login-btn " to="/login">
                  LOGIN
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*
            <div className="alert alert-danger mt-5 pt-5" role="alert">
              <strong>
            असुविधा के लिए खेद है,हमारे पेमेंट गेटवे पार्टनर की तकनीकी खामियों की वजह से डिपॉजिट और विड्रवाल मैं  समस्या आ रही है । कृपया सभी प्लेयर्स से अनुरोध है की धैर्य बनाए रखे आपका अमाउंट सेफ है और समस्या के निवारण मैं 48 से 72 घंटे लग सकते
              </strong>
            </div>
            */}
    </div>
  );
};
