import React from "react";
import Header from "../Components/Header";
import Rightcontainer from "../Components/Rightcontainer";
import { Link } from "react-router-dom";
import "../css/homepage.css";

const Support = ({ handleShow }) => {
  return (
    <div>
      <div
        className="leftContainer"
        style={{ minHeight: "100vh", height: "100%" }}
      >
        <div className="pt-5 mt-5  Orher_page_main_section">
          <div className=" ">
            <div className="profile_headings mt-4">
              Contact us at below platforms.
            </div>
            <div className="row mt-3">
              {/* youtube */}
              {/* <div className="col-6 col-lg-4 col-md-3 col-sm-12 mb-3">
                <div className="support_samll_card_btn_type">
                  <div className="col-4  d-flex justify-content-around w-80">
                    <a
                      className="cxy flex-column"
                      target="_blank"
                      // href={
                      //   JSON.parse(localStorage.getItem('sitSetting')) == 'undefined'
                      //     ? ''
                      //     : JSON.parse(localStorage.getItem('sitSetting'))
                      //         ?.supportInstagram
                      // }
                      //href="https://www.instagram.com/RKZONESofficial/"
                    >
                      <img width="50px" src="/insta.png" alt="" />
                      <span className="footer-text-bold">Instagram</span>
                    </a>
                  </div>
                </div>
              </div> */}

              {/* mail */}
              {/* <div className="col-6 col-lg-4 col-md-3 col-sm-12 mb-3">
                <div className="support_samll_card_btn_type">
                  <a className="cxy flex-column" href="mailto:info@ganeshludo.com">
                    <div className="col-12 my-2 text-center font-weight-bold">
                      <a
                        className="cxy flex-column"
                        href={
                          JSON.parse(localStorage.getItem("sitSetting")) ==
                          "undefined"
                            ? ""
                            : JSON.parse(localStorage.getItem("sitSetting"))
                                ?.CompanyEmail
                        }
                      >
                        <img
                          width="50px"
                          src={process.env.PUBLIC_URL + "/images/mail.png"}
                          alt=""
                        />
                        <span className="footer-text-bold">
                          {JSON.parse(localStorage.getItem("sitSetting")) ==
                          "undefined"
                            ? ""
                            : JSON.parse(localStorage.getItem("sitSetting"))
                                ?.CompanyEmail}
                        </span>
                      </a>
                    </div>
                  </a>
                </div>
              </div> */}

              {/* whatsapp */}
              <div className="col-6 col-lg-4 col-md-3 col-sm-12 mb-3">
                <div className="support_samll_card_btn_type">
                  {JSON.parse(localStorage.getItem("sitSetting")) ==
                  "undefined" ? (
                    ""
                  ) : JSON.parse(localStorage.getItem("sitSetting"))
                      ?.whatsapp ? (
                    <>
                      <a
                        href={
                          JSON.parse(localStorage.getItem("sitSetting")) ==
                          "undefined"
                            ? ""
                            : JSON.parse(localStorage.getItem("sitSetting"))
                                ?.whatsapp
                        }
                        target="_blank"
                      >
                        <img
                          width="50px"
                          src={process.env.PUBLIC_URL + "/images/whatsapp.png"}
                          alt=""
                        />
                        <span className="">WhatsApp</span>
                      </a>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {/* telegram */}
              <div className="col-6 col-lg-4 col-md-3 col-sm-12 mb-3">
                <div className="support_samll_card_btn_type">
                  <img
                    width="50px"
                    src={process.env.PUBLIC_URL + "/images/telegram.png"}
                    alt=""
                  />
                  <span className="">
                    <a
                      target="_blank"
                      href={
                        JSON.parse(localStorage.getItem("sitSetting")) ==
                        "undefined"
                          ? ""
                          : "tel:" +
                            JSON.parse(localStorage.getItem("sitSetting"))
                              ?.CompanyMobile
                      }
                    >
                      {JSON.parse(localStorage.getItem("sitSetting")) ==
                      "undefined"
                        ? ""
                        : JSON.parse(localStorage.getItem("sitSetting"))
                            ?.CompanyMobile}
                    </a>
                  </span>
                </div>
              </div>
              {/* <div className="col-12 col-lg-12 col-md-12 col-sm-12 mb-3">
                <p className="company_address">
                  <h3>Address:</h3>
                  <span className="footer-text-bold">
                    {JSON.parse(localStorage.getItem("sitSetting")) ==
                    "undefined"
                      ? ""
                      : JSON.parse(localStorage.getItem("sitSetting"))
                          ?.CompanyAddress}
                  </span>
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </div>
  );
};

export default Support;
