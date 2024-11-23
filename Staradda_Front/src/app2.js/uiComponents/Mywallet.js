import React, { useEffect, useState } from "react";
import css from "../css/Mywallet.module.css";
import Rightcontainer from "../Components/Rightcontainer";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

const Mywallet = () => {
  const history = useHistory();
  let access_token = localStorage.getItem("token");
  access_token = localStorage.getItem("token");
  const [user, setUser] = useState();
  const EndPoint = process.env.REACT_APP_API_URL;

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    access_token = localStorage.getItem("token");
    if (!access_token) {
      window.location.reload();
      history.push("/login");
    }
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(`${EndPoint}/me`, { headers })
      .then((res) => {
        setUser(res.data);
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });
  }, []);

  return (
    <>
      <div className="leftContainer grident_bg" style={{ height: "100%" }}>
        <div className="main_area" style={{ paddingTop: "12%" }}>
          <div
            className="p-4 "

            // style={{ border: '1px solid #e0e0e0', borderRadius: '5px' }}
          >
            <Link
              className={`d-flex align-items-center wallet_btn ${css.profile_wallet} undefined`}
              to="/transaction-history"
            >
              <picture className="">
                <img
                  width="32px"
                  src={process.env.PUBLIC_URL + "/images/icons/history.png"}
                  alt=""
                />
              </picture>
              <div className={`${css.mytext} wallet_btn_text `}>
                Order History
              </div>
            </Link>

            <div
              className={`${css} XXsnipcss_extracted_selector_selectionXX snipcss0-0-0-1 tether-target-attached-top tether-abutted tether-abutted-top tether-element-attached-top tether-element-attached-center tether-target-attached-center`}
            ></div>
            <div className="pt-5 grident_bg">
              <div className="wallet_card wallet_card_box">
                <div className="d-flex align-items-center">
                  <picture className="mr-1">
                    <img
                      height="26px"
                      width="26px"
                      src={
                        process.env.PUBLIC_URL +
                        "images/LandingPage_img/global-rupeeIcon.png"
                      }
                      alt=""
                    />
                  </picture>
                  <span className="wallet_card_text_amount">
                    ₹{user && user.Wallet_balance}
                  </span>
                </div>
                <div className="wallet_card_text">Deposit Cash</div>
                <div
                  className={`${css.my_text}  mt-3 mb-3 wallet_card_text_para`}
                >
                  Can be used to play Tournaments &amp; Battles.
                  <br />
                  Cannot be withdrawn to Paytm or Bank.
                </div>
                <Link to="/addcase">
                  <button
                    className={`${css.walletCard_btn} d-flex justify-content-center align-items-center text-uppercase`}
                  >
                    Add Cash
                  </button>
                </Link>
              </div>
              <div className="wallet_card wallet_card_box">
                <div className="d-flex align-items-center">
                  <picture className="mr-1">
                    <img
                      height="26px"
                      width="26px"
                      src={
                        process.env.PUBLIC_URL +
                        "images/LandingPage_img/global-rupeeIcon.png"
                      }
                      alt=""
                    />
                  </picture>
                  <span className="wallet_card_text_amount">
                    ₹{user && user.withdrawAmount}
                  </span>
                </div>
                <div className="wallet_card_text">Winning Cash</div>
                <div
                  className={`${css.my_text2} mt-3 mb-3 wallet_card_text_para`}
                >
                  Can be withdrawn to Paytm or Bank. Can be used to play
                  Tournaments &amp; Battles.
                </div>
                <Link to="/Withdrawopt">
                  <button
                    className={`${css.walletCard_btn} d-flex justify-content-center align-items-center text-uppercase`}
                  >
                    Withdraw
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rightContainer">
        <div>
          <Rightcontainer />
        </div>
      </div>
    </>
  );
};
export default Mywallet;
