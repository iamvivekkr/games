import React, { memo, useEffect, useState, useRef } from "react";
import css from "../Modulecss/Home.module.css";
import acceptSound from "./accept.mp3";
import findGif from "../css/loading_old.gif";
import playSound from "./play.mp3";
import { useHistory } from "react-router-dom";

const BetCard = React.memo(
  ({
    allgame,
    user,
    deleteChallenge,
    getPost,
    challangeReqRun,
    RejectGame,
    winnAmount,
    AcceptChallang,
    updateChallenge,
  }) => {
    const history = useHistory();
    const [disable, setDisable] = React.useState(challangeReqRun);
    const [disable_play, setDisable_play] = React.useState(false);
    // const[challangeReqRun,setChallangeReqRun]=useState(true);
    const [load, reload] = useState(false);
    const EndPoint = process.env.REACT_APP_API_URL;

    const req_chall_fun = (allgameId) => {
      getPost(allgameId);
    };
    const isMounted = useRef(true);
    const disablebtn = (id) => {
      setDisable(true);
      setTimeout(() => {
        setDisable(false);
      }, 3000);
      //  sendMessage()
    };

    const disable_play_btn = () => {
      setDisable_play(true);
      setTimeout(() => {
        setDisable_play(false);
      }, 3000);
      // status_fun()
    };

    let state = {
      creator: "123",
      acceptor: "321",
      gameId: "ujhgf532dgbh63",
    };

    return (
      <div className={`${css.betCard} mt-2`}>
        <span
          className={`${css.betCardTitle} pl-3 d-flex align-items-center text-uppercase ${css.betTitleDiv}`}
        >
          CHALLENGE FROM
          <span className="ml-1" style={{ color: "brown" }}>
            {allgame?.Created_by?.Name}
          </span>
          {user == allgame?.Created_by?._id && allgame?.Status == "new" && (
            <button
              className={` p-1 m-1 mb-1 ml-auto btn-danger btn-sm`}
              onClick={() => deleteChallenge(allgame?._id)}
            >
              DELETE
            </button>
          )}
          {user == allgame?.Created_by?._id &&
            allgame?.Status == "requested" && (
              <div className="d-flex ml-auto align-items-center">
                <button
                  className={`bg-success position-relative mx-1 btn-sm text-white btn-inverse-success`}
                  disabled={disable}
                  style={{ display: disable ? "none" : "block" }}
                  onClick={(e) => {
                    disablebtn(allgame._id);
                    req_chall_fun(allgame._id);
                  }}
                >
                  START
                </button>
                <button
                  className={
                    disable
                      ? "btn btn-primary d-block"
                      : "btn btn-primary d-none"
                  }
                >
                  Wait
                </button>

                <button
                  className={
                    disable
                      ? "d-none text-white bg-danger position-relative mx-1 btn-sm btn-outline-youtube"
                      : "text-white bg-danger position-relative mx-1 btn-sm btn-outline-youtube d-block"
                  }
                  onClick={() => RejectGame(allgame._id)}
                  style={{ bottom: "0" }}
                >
                  REJECT
                </button>
              </div>
            )}
        </span>
        <div className={`d-flex pl-3 ${css.betBodyDiv}`}>
          <div className="pr-3 pb-1">
            <span className={css.betCardSubTitle}>Entry Fee</span>
            <div>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/Images/LandingPage_img/global-rupeeIcon.png"
                }
                alt=""
                width="21px"
              />
              <span className={css.betCardAmount}>{allgame?.Game_Ammount}</span>
            </div>
          </div>
          <div>
            <span className={css.betCardSubTitle}>Prize</span>
            <div>
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/Images/LandingPage_img/global-rupeeIcon.png"
                }
                alt=""
                width="21px"
              />
              <span className={css.betCardAmount}>
                {allgame?.Game_Ammount + winnAmount(allgame?.Game_Ammount)}
              </span>
            </div>
          </div>
          {user !== allgame?.Created_by?._id && allgame?.Status == "new" && (
            <button
              className={`${css.bgSecondary} ${css.playButton} ${css.cxy} btn-sm`}
              disabled={disable_play}
              onClick={() => {
                disable_play_btn();
                AcceptChallang(allgame._id);
              }}
            >
              Play
            </button>
          )}
          {/* {user == allgame.Accepetd_By._id && allgame.Status == 'running' && <button className={`${css.bgSecondary} ${css.playButton} ${css.cxy}`} >start</button>} */}
          {user == allgame?.Created_by?._id && allgame?.Status == "new" && (
            <div className="text-center col-5 ml-auto mt-auto mb-auto">
              <div className="pl-2 text-center">
                <img src={findGif} style={{ width: "15px", height: "15px" }} />
              </div>
              <div style={{ lineHeight: 1 }}>
                <span className={css.betCard_playerName}>Finding Player!</span>
              </div>
            </div>
          )}
          {user !== allgame?.Created_by._id &&
            allgame?.Status == "requested" && (
              <div className="d-flex ml-auto align-items-center">
                <div
                  className={`${css.bgSecondary} ${css.playButton} ${css.cxy} position-relative mx-1 text-white btn-sm`}
                >
                  requested
                </div>
                <button
                  className={`${css.bgSecondary} ${css.playButton} ${css.cxy} position-relative mx-1 bg-danger btn-sm`}
                  onClick={() => RejectGame(allgame?._id)}
                >
                  cancel
                </button>
              </div>
            )}
          {user !== allgame?.Created_by._id && allgame?.Status == "running" && (
            <div className="d-flex ml-auto align-items-center">
              <audio src={playSound} autoPlay></audio>

              <button
                disabled={disable}
                className={`${css.bgSecondary} ${css.playButton} ${css.cxy} bg-success btn-sm'`}
                onClick={(e) => {
                  disablebtn();
                  updateChallenge(allgame._id);
                  history.push(`/viewgame1/${allgame._id}`, {
                    prevPath: window?.location?.pathname,
                  });
                }}
              >
                start
              </button>
            </div>
          )}
          {user == allgame?.Created_by._id &&
            allgame?.Status == "requested" && (
              <div className="d-flex ml-auto align-items-center mr-5 mt-1">
                <audio src={acceptSound} autoPlay></audio>

                <div className="text-center col">
                  <div className="pl-2">
                    {allgame?.Accepetd_By.avatar ? (
                      <img
                        src={`${EndPoint}/${allgame.Accepetd_By.avatar}`}
                        alt=""
                        width="40px"
                        height="40px"
                        style={{
                          borderTopLeftRadius: "50%",
                          borderTopRightRadius: "50%",
                          borderBottomRightRadius: "50%",
                          borderBottomLeftRadius: "50%",
                          marginTop: "5px",
                        }}
                      />
                    ) : (
                      <img
                        src={`/user.png`}
                        alt=""
                        width="40px"
                        height="40px"
                        style={{
                          borderTopLeftRadius: "50%",
                          borderTopRightRadius: "50%",
                          borderBottomRightRadius: "50%",
                          borderBottomLeftRadius: "50%",
                          marginTop: "5px",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ lineHeight: 1 }}>
                    <span className={css.betCard_playerName}>
                      {allgame.Accepetd_By.Name}
                    </span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
);

export default memo(BetCard);
