import React from "react";
import css from "../Modulecss/Home.module.css";
import { Link } from "react-router-dom";

export default function RunningCard({ runnig, user, winnAmount, game_type }) {
  const EndPoint = process.env.REACT_APP_API_URL;
  return (
    <div className={`${css.betCard} battle_card_main mt-1`}>
      <div className="d-flex">
        <span
          className={`${css.betCardTitle} pl-3 d-flex align-items-center text-uppercase headings`}
        >
          PLAYING FOR
          <img
            className="mx-1"
            src={
              process.env.PUBLIC_URL +
              "/images/LandingPage_img/global-rupeeIcon.png"
            }
            alt=""
            width="21px"
          />
          {runnig?.Game_Ammount}
        </span>
        {(user == runnig?.Accepetd_By._id ||
          user == runnig?.Created_by._id) && (
          <Link
            className={`${css.bgSecondary} ${css.playButton} ${
              css.cxy
            } position-relative m-2 mx-1 ${
              runnig.Status == "conflict" ? "bg-danger" : "bg-success"
            }`}
            style={{
              right: "0px",
              top: "-6px",
              padding: "10px 17px",
            }}
            to={{
              pathname: `/viewgame1/${runnig?._id}`,
              state: { prevPath: window.location.pathname },
            }}
          >
            view
          </Link>
        )}
        <div
          className={`${css.betCardTitle} d-flex align-items-center text-uppercase`}
        >
          <span className="ml-auto mr-3 headings">
            PRIZE
            <img
              className="mx-1"
              src="/images/global-rupeeIcon.png"
              alt=""
              width="21px"
            />
            {runnig.Game_Ammount + winnAmount(runnig.Game_Ammount)}
          </span>
        </div>
      </div>
      <div className="py-1 row">
        <div className="pr-3 text-center col-5">
          <div className="pl-2">
            {runnig.Created_by.avatar ? (
              <img
                src={`${EndPoint}/${
                  runnig.Created_by && runnig.Created_by.avatar
                }`}
                // onError={(e) => {
                //   e.target.onerror = null;
                //   e.target.src = `${EndPoint}/user.png`;
                // }}
                alt=""
                width="30px"
                height="30px"
                style={{
                  borderTopLeftRadius: "50%",
                  borderTopRightRadius: "50%",
                  borderBottomRightRadius: "50%",
                  borderBottomLeftRadius: "50%",
                }}
              />
            ) : (
              <img
                src="/images/avatars/Avatar2.png"
                width="30px"
                height="30px"
                alt="user"
                style={{ borderRadius: "50%" }}
              />
            )}
          </div>
          <div style={{ lineHeight: 1 }}>
            <span className={`${css.betCard_playerName} headings`}>
              {runnig.Created_by.Name}
            </span>
          </div>
        </div>
        <div className="pr-3 text-center col-2 cxy">
          <div>
            <img
              src={process.env.PUBLIC_URL + "/images/Homepage/versus.png"}
              alt=""
              width="21px"
            />
          </div>
        </div>
        <div className="text-center col-5">
          <div className="pl-2">
            {runnig.Accepetd_By.avatar ? (
              <img
                src={`${EndPoint}/${
                  runnig.Accepetd_By && runnig.Accepetd_By.avatar
                }`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${EndPoint}/user.png`;
                }}
                alt=""
                width="30px"
                height="30px"
                style={{
                  borderTopLeftRadius: "50%",
                  borderTopRightRadius: "50%",
                  borderBottomRightRadius: "50%",
                  borderBottomLeftRadius: "50%",
                }}
              />
            ) : (
              <img
                src="/images/avatars/Avatar3.png"
                width="30px"
                height="30px"
                alt="user"
                style={{ borderRadius: "50%" }}
              />
            )}
          </div>
          <div style={{ lineHeight: 1 }}>
            <span className={`${css.betCard_playerName} headings`}>
              {runnig.Accepetd_By.Name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
