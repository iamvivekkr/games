import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import socket from "../Components/socket";
import "../css/landing.css";
import { Collapse } from "react-bootstrap";
import Rightcontainer from "../Components/Rightcontainer";
import Downloadbutton from "../Components/Downloadbutton";
import TawkTo from "tawkto-react";
import Header from "../Components/Header";

export default function Landing() {
  const [open, setOpen] = useState(false);
  const [userAllData, setUserAllData] = useState();
  const EndPoint = process.env.REACT_APP_API_URL;

  useEffect(() => {
    socket.emit("websetting", "");
    console.log("emit");
  }, []);

  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .get(`${EndPoint}/me`, { headers })
      .then((res) => {
        setUserAllData(res.data);
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          //window.location.href = "/login";
        }
      });
  };

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    access_token = localStorage.getItem("token");
    if (!access_token) {
      //window.location.reload()
    }
    role();
  }, []);

  const [siteSetting, setsiteSetting] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("sitSetting"));
    if (items) {
      setsiteSetting(items);
    }
  }, []);
  return (
    <>
      <Header user={userAllData} />
      <div className="leftContainer">
        <div className="main-area" style={{ paddingTop: "60px" }}>
          {/* <div className="collapseCard-container"><div className="collapseCard"><a href="https://www.youtube.com/watch?v=PsYSdiF-bZU" target="_blank" style={{textDecoration: 'none'}}><div className="collapseCard-body" style={{height: '64px', opacity: 1, transition: 'height 0.3s ease 0s, opacity 0.3s ease 0s'}}><div className="collapseCard-text text-dark">How to win money?</div></div></a><div className="collapseCard-header" style={{left: '22px', transition: 'left 0.3s ease 0s'}}><picture><img height="10px" width="14px" src="/images/global-ytPlayIcon.png" alt="" /></picture><div className="collapseCard-title ml-1 mt-1">Video Help</div></div></div></div> */}
          <div className="gameCard ">
            {/* <h5
              className='home_page_message'
              style={{
                padding: '0 14px',
                textAlign: 'center',
                color: 'teal',
                fontWeight: 'bold'
              }}
            >
              जिनके पहले विड्रवाल पेंडिन(pending) जा चुके है उनका विड्रवाल 48 से
              72 घंटे मैं समाप्त हो जायेगा
            </h5> */}
            {/* <h5
              style={{ padding: '0 14px', textAlign: 'center', color: 'red' }}
            >
              जिनका पेमेंट successful हुवा वॉलेट में ऐड या लेकिन डिपोसिट नहीं
              हुआ वह बैंक खाते में 5-7 दिन में रिफंड कर दिया जायेगा 7 दिन में
              रिफंड नहीं आता है तो हमे संपर्क करें! यह समस्या बैंक के कारन हुई
              है इसलिए कृपया धैर्य रखें ! धन्यवाद ..🙏
            </h5>
            <h5
              style={{ padding: '0 14px', textAlign: 'center', color: 'red' }}
            >
              जिनके पहले विड्रवाल पेंडिन(pending) जा चुके है उनका विड्रवाल 48 से
              72 घंटे मैं समाप्त हो जायेगा
            </h5> */}
            {/*<h5 className="text-danger pt-3">
                    <marquee>⚠जिनका पेमेंट success हुआ वॉलेट में ऐड या लेकिन डिपोसिट नहीं हुआ. वह बैंक खाते में 5-7 दिन में रिफंड कर दिया जायेगा 7 दिन में रिफंड नहीं आता है तो हमे संपर्क करें! यह समस्या बैंक के कारन हुई है इसलिए कृपया  धैर्य रखें&nbsp;!&nbsp;धन्यवाद&nbsp;..🙏</marquee>
                </h5>
            {/* <h5
              className="text-danger mx-2"
              style={{
                lineHeight: '20px',
                fontSize: '12px',
                transition: '0.5s',
              }}
            >
              {JSON.parse(localStorage.getItem('sitSetting')) == 'undefined'
                ? ''
                : JSON.parse(localStorage.getItem('sitSetting'))?.site_message}
            </h5> */}
          </div>

          <div class="gameCard ">
            <p class="commission_div">
              Commission: 5% ◉ Referral: 2% For All Games
            </p>
            <div class="home_message_div">
              <p>
                बिना रूम कोड के अगर विन का स्क्रीनशॉट अपडेट करते हो तो आपकी टेबल
                अपडेट नहीं होगी सभी यूजर अपना किंग पास ले ले और रूम कोड के साथ
                विन स्क्रीनशॉट डालें
              </p>
              <p style={{ color: "#a84000", textAlign: "center" }}>
                Help Line no. <strong>7851825211</strong>
              </p>
            </div>
            
          </div>

          {/* <section className="games-section p-3">
            <div className="d-flex align-items-center games-section-title">
              Game Tournaments
            </div>
            <div className="games-section-headline mt-2 mb-1">
         
              <div className="games-window ">
                <Link
                  className="gameCard-container"
                  to={`/Homepage/Ludo%20Classics`}
                >
                  <Link
                    className="gameCard pt-2 "
                    to={`/Homepage/Ludo%20Classics`}
                  >
                    <span className="d-none blink text-success d-block text-right">
                      ◉ LIVE
                    </span>
                    <picture className="gameCard-image">
                      <img
                        width="100%"
                        src={
                          JSON.parse(localStorage.getItem('sitSetting')) ==
                          'undefined'
                            ? ''
                            : 'https://backend.ZUSS.in/' +
                              JSON.parse(localStorage.getItem('sitSetting'))
                                ?.ludokingClassic
                        }
                        alt=""
                      />
                    </picture>
                    <div className="gameCard-title">Ludo Classics</div>
                  </Link>
                  <div className="goverlay">
                    <div className="text">Comming Soon</div>
                  </div>

                </Link>
                <Link
                  className="gameCard-container"
                  to={`/Homepage/Ludo%20Popular`}
                >
                  <Link
                    className="gameCard pt-2 "
                    to={`/Homepage/Ludo%20Popular`}
                  >
                    <span className="d-none blink text-success d-block text-right">
                      ◉ LIVE
                    </span>
                    <picture className="gameCard-image">
                      <img
                        width="100%"
                        src={
                          JSON.parse(localStorage.getItem('sitSetting')) ==
                          'undefined'
                            ? ''
                            : 'https://backend.ZUSS.in/' +
                              JSON.parse(localStorage.getItem('sitSetting'))
                                ?.ludokingPopular
                        }
                        alt=""
                      />
                     
                    </picture>
                    <div className="gameCard-title">Ludo Popular</div>
                  </Link>
                  <div className="goverlay">
                    <div className="text">Comming Soon</div>
                  </div>
                </Link>
              </div>
            </div>
          </section> */}
          <section className="new_game_section">
            <div className="games-section-headline  mb-1">
              <section className="game_small_boxes_main_bg">
                <div class="d-flex align-items-center games-section-title">
                  Our Games
                </div>
                <div className="row">
                  <div className="col-6">
                    <Link
                      className="gameCard-container"
                      to={`Homepage/ludoClassicManual`}
                    >
                      <div className="game_small_boxes">
                        <picture class="game_small_boxes_img_box">
                          <div class="live_blink_box blink">
                            <span class=" d-block text-right">◉ LIVE</span>
                          </div>
                          <img
                            src="/images/LandingPage_img/manual.png"
                            alt=""
                          />
                        </picture>
                        <h4 class="">Manual Room Code</h4>
                      </div>
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      className="gameCard-container"
                      to={`Homepage/ludoClassicManual`}
                    >
                      <div className="game_small_boxes">
                        <picture class="game_small_boxes_img_box">
                          <div class="live_blink_box blink">
                            <span class=" d-block text-right">◉ LIVE</span>
                          </div>
                          <img
                            src="/images/LandingPage_img/auto-room.png"
                            alt=""
                          />
                        </picture>
                        <h4 class="">Auto Room Code</h4>
                      </div>
                    </Link>
                  </div>

                  <div class="col-6">
                    <div class="game_small_boxes">
                      <Link class="" href="#">
                        <picture class="game_small_boxes_img_box">
                          <div class="live_blink_box blink">
                            <span class=" d-block text-right">
                              ◉ Comming Soon
                            </span>
                          </div>
                          <img
                            src="/images/LandingPage_img/casino.png"
                            alt=""
                          />
                        </picture>
                        <h4 class="">Comming Soon</h4>
                      </Link>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="game_small_boxes">
                      <a class="" href="#">
                        <a class=" " href="#">
                          <picture class="game_small_boxes_img_box">
                            <img
                              src="/images/LandingPage_img/call.png"
                              alt=""
                            />
                          </picture>
                          <h4 class="">Comming Soon</h4>
                        </a>
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
          <section className="footer">
            <div className="footer-divider" />
            {/* <a
              className="px-3 py-4 d-flex align-items-center"
              href="#!"
              style={{ textDecoration: "none" }}
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              <picture className="icon">
                <img
                  src="/images/khelohublogo.png"
                  width="56px"
                  height="56px"
                  alt="profile"
                  style={{ width: "100%", height: "32px" }}
                />
              </picture>
              <span
                style={{
                  color: "rgb(149, 149, 149)",
                  fontSize: "1em",
                  fontWeight: 400,
                }}
                className={!open ? "d-block" : "d-none"}
              >
                {" "}
                . Terms, Privacy, Support
              </span>

              {open ? (
                <i
                  className="mdi mdi-chevron-up ml-auto"
                  style={{ fontSize: "1.7em", color: "rgb(103, 103, 103)" }}
                ></i>
              ) : (
                <i
                  style={{ fontSize: "1.7em", color: "rgb(103, 103, 103)" }}
                  className="mdi mdi-chevron-down ml-auto"
                ></i>
              )}
            </a> */}
            {/* <Collapse in={open}>
              <div id="example-collapse-text" className="px-3 overflow-hidden">
                <div className="row footer-links">
                  <Link className="col-6" to="/term-condition">
                    Terms &amp; Condition
                  </Link>
                  <Link className="col-6" to="/PrivacyPolicy">
                    Privacy Policy
                  </Link>
                  <Link className="col-6" to="/RefundPolicy">
                    Refund/Cancellation Policy
                  </Link>
                  <Link className="col-6" to="/contact-us">
                    Contact Us
                  </Link>
                  <Link className="col-6" to="/responsible-gaming">
                    Responsible Gaming
                  </Link>
                </div>
              </div>
            </Collapse> */}
            <div className="footer-divider" />
            <div className="px-3 py-4">
              <div className="footer-text-bold">About Us</div>

              <div className="footer-text">
                GaneshLudo is a real-money gaming product owned and operated by
                Ganesh ludo ("GaneshLudo" or "We" or "Us" or "Our").Our games
                are especially compressed and optimised to work on low-end
                devices, uncommon browsers, and patchy internet speeds.
              </div>

              {/* <div className="footer-text-bold mt-3">
                Our Business &amp; Products
              </div>

              <div className="footer-text mt-2">
                We are an HTML5 game-publishing company and our mission is to
                make accessing games fast and easy by removing the friction of
                app-installs.
              </div> */}
              {/* 
              <div className="footer-text mt-2">
                ZUSS is a skill-based real-money gaming platform accessible only
                for our users in India. It is accessible on{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.ZUSS.in"
                >
                  https://www.ZUSS.in
                </a>
                . On ZUSS, users can compete for real cash in Tournaments and
                Battles. They can encash their winnings via popular options such
                as Paytm Wallet, Amazon Pay, Bank Transfer, Mobile Recharges
                etc.
              </div> */}

              {/* <div className="footer-text-bold mt-2">Our Games</div>

              <div className="footer-text">
                ZUSS has a wide-variety of high-quality, premium HTML5 games.
                Our games are especially compressed and optimised to work on
                low-end devices, uncommon browsers, and patchy internet speeds.
              </div>

              <div className="footer-text mt-2">
                We have games across several popular categories: Arcade, Action,
                Adventure, Sports &amp; Racing, Strategy, Puzzle &amp; Logic. We
                also have a strong portfolio of multiplayer games such as Ludo,
                Chess, 8 Ball Pool, Carrom, Tic Tac Toe, Archery, Quiz, Chinese
                Checkers and more! Some of our popular titles are: Escape Run,
                Bubble Wipeout, Tower Twist, Cricket Gunda, Ludo With Friends.
                If you have any suggestions around new games that we should add
                or if you are a game developer yourself and want to work with
                us, don't hesitate to drop in a line at{" "}
                <a href="mailto:info@ZUSS.in">info@ZUSS.in</a>!
              </div> */}
            </div>
          </section>
          <div className="downloadButton">
            <Downloadbutton />
          </div>
        </div>
      </div>

      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </>
  );
}
