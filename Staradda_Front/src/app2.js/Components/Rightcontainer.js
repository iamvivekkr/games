import React, { Profiler } from "react";

const Rightcontainer = () => {
  return (
    <div>
      <div className="rightContainer">
        <div className="rcBanner flex-center ">
          <picture className="rcBanner-img-container animate__bounce infinite ">
            <img src="/images/khelohublogo.png" />
          </picture>
          <div className="rcBanner-text " style={{ fontWeight: "bolder" }}>
            GANESH&nbsp;
            <span
              className="rcBanner-text-bold"
              style={{ fontWeight: "normal" }}
            >
              Ludo Wins = Real Cash In!
            </span>
          </div>
          <div className="rcBanner-footer">
            For best experience, open&nbsp;
            <a
              href="/"
              style={{
                color: "rgb(44, 44, 44)",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              ganeshludo.com
            </a>
            &nbsp;on&nbsp;
            <img src={process.env.PUBLIC_URL + "/images/chrome.png"} alt="" />
            &nbsp;chrome mobile
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightcontainer;
