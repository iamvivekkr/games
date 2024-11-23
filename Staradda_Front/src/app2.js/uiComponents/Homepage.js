import React, { useEffect, useRef, useState } from "react";
import "../css/layout.css";
import css from "../Modulecss/Home.module.css";
import axios from "axios";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Rightcontainer from "../Components/Rightcontainer";
import { useDispatch } from "react-redux";
import BetCard from "./BetCard";
import RunningCard from "./RunningCard";
import Header from "../Components/Header";
import io from "../Components/socket";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Landing from "./Landing";
export default function Homepage({ walletUpdate }) {
  const history = useHistory();
  let userID = useRef();
  const isMounted = useRef(true);
  let str;
  /// user details start

  const [user, setUser] = useState();
  const [created, setCreated] = useState([]);
  const [challangeReqRun, setChallangeReqRun] = useState(false);

  const [game_amount, setGame_amt] = useState();

  const [userAllData, setUserAllData] = useState();

  const [gameData, setGameData] = useState({});

  const [submitProcess, setProcess] = useState(true);
  const [isLoading, setIsloading] = useState(false);
  const addsetting = localStorage.getItem("sitSetting");
  const addCaseSetting = JSON.parse(addsetting);

  const access_token = localStorage.getItem("token");
  const EndPoint = process.env.REACT_APP_API_URL;

  const role = async () => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .get(`${EndPoint}/me`, { headers })
      .then((res) => {
        setUser(res.data._id);
        setUserAllData(res.data);
        userID.current = res.data._id;
        setMount(true);
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          // window.location.reload()
          setTimeout(() => {
            //  history.push("/login")
          }, 500);
        }
        if (e.response.status == 400 || e.response.status == 429) {
          Swal.fire({
            title: "Please refresh!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  /// user details end
  // console.log(useLocation().pathname.split('/')[2], '  useLocation().pathname')
  const [game_type, setGame_type] = useState(
    useLocation().pathname.split("/")[2]
  );
  const [game_type2, setGame_type2] = useState(
    useLocation().pathname.split("/")[2]
  );
  const [Game_Ammount, setGame_Ammount] = useState("");

  //   console.log(game_type);

  const ChallengeCreate = (e) => {
    setIsloading(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .post(
        `${EndPoint}/challange/create`,
        {
          Game_Ammount,
          Game_type: game_type,
        },
        { headers }
      )
      .then((res) => {
        setGame_amt(res?.data?.data?.Game_Ammount);

        if (res.data.status == false) {
          setIsloading(false);
          Swal.fire({
            title: res.data.msg,
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (res.data.msg === "you have already enrolled") {
          setIsloading(false);
          Swal.fire({
            title: "You have already enrolled",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (res.data.msg === "You can set maximum 2 battle.") {
          setIsloading(false);
          Swal.fire({
            title: "You can set maximum 2 battle.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (res.data.msg === "Insufficient balance") {
          setIsloading(false);
          Swal.fire({
            title: "Insufficient balance",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (
          res.data.msg ===
          "Game amount should be Greater then 50 and less then 50000"
        ) {
          setIsloading(false);
          Swal.fire({
            title: "Game amount should be Greater then 50 and less then 50000",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (res.data.msg === "Set Battle in denomination of 50") {
          setIsloading(false);
          Swal.fire({
            title: "Set Battle in denomination of 50",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else if (res.data.msg === "Technical Issue, Try after an hour!") {
          setIsloading(false);
          Swal.fire({
            title: "Technical Issue, Try after an hour!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          setIsloading(false);
          // Allgames();
          // io.emit("gameCreated");
        }
      })
      .catch((e) => {
        setIsloading(false);
        if (e?.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
            //  history.push("/login")
          }, 500);
        }
        if (e?.response?.status == 400 || e?.response?.status == 429) {
          Swal.fire({
            title: "Please refresh!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        console.log(e);
      });
  };

  const [allgame, setallgame] = useState([]);
  const [mount, setMount] = useState(false);
  const [ALL, setALL] = useState();
  const [runningGames, setRunningGames] = useState([]);
  const [ownRunning, setOwnRunning] = useState([]);

  const Allgames = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(`${EndPoint}/challange/all`, { headers })
      .then((res) => {
        let owenedCreated = [],
          remainingGame = [];
        res.data.forEach(function (ele) {
          if (
            ele.Created_by._id == user &&
            (ele.Status == "new" || ele.Status == "requested")
          ) {
            owenedCreated.push(ele);
          } else {
            remainingGame.push(ele);
          }
        });
        setCreated(owenedCreated);
        setallgame(remainingGame);
      })
      .catch((e) => {
        if (e?.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
            //  history.push("/login")
          }, 500);
        }
        if (e?.response?.status == 400 || e?.response?.status == 429) {
          Swal.fire({
            title: "Please refresh!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  const runningGame = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(`${EndPoint}/challange/running/all`, { headers })
      .then((res) => {
        let owenedRunning = [],
          remainingRunning = [];
        res.data.forEach(function (ele) {
          if (ele.Created_by && ele.Accepetd_By)
            if (
              ele.Created_by?._id == userID.current ||
              ele.Accepetd_By?._id == userID.current
            ) {
              owenedRunning.push(ele);
            } else {
              remainingRunning.push(ele);
            }
        });
        setOwnRunning(owenedRunning);
        setRunningGames(remainingRunning);
      })
      .catch((e) => {
        console.log("errror", e);
        if (e.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          // window.location.reload()
          //    setTimeout(() => {
          // //  history.push("/login")
          // }, 500);
        }
        if (e.response?.status == 400 || e.response?.status == 429) {
          Swal.fire({
            title: "Please refresh!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  function winnAmount(gameAmount) {
    let profit = null;
    if (gameAmount >= 50 && gameAmount <= 250) profit = (gameAmount * 10) / 100;
    else if (gameAmount > 250 && gameAmount <= 500) profit = 25;
    else if (gameAmount > 500) profit = (gameAmount * 5) / 100;
    return gameAmount - profit;
  }

  useEffect(() => {
    io.on("gamelist", (data) => {
      // console.log("gamelist");
      console.log("creategame, challengeAccepted, updateReject", data);
      let owenedCreated = [],
        remainingGame = [];
      data.forEach(function (ele) {
        if (ele.Created_by)
          if (
            ele.Created_by._id == userID.current &&
            (ele.Status == "new" || ele.Status == "requested")
          ) {
            owenedCreated.push(ele);
          } else {
            remainingGame.push(ele);
          }
      });
      // console.log('own',owenedCreated,'remiain',remainingGame);
      setCreated(owenedCreated);
      setallgame(remainingGame);
    });

    io.on("resultUpdateReq", (data) => {
      // console.log('resultUpdateReq')
      let owenedRunning = [],
        remainingRunning = [];
      data.forEach(function (ele) {
        if (ele.Created_by && ele.Accepetd_By)
          if (
            ele.Created_by._id == userID.current ||
            ele.Accepetd_By._id == userID.current
          ) {
            owenedRunning.push(ele);
          } else {
            remainingRunning.push(ele);
          }
      });
      setOwnRunning(owenedRunning);
      setRunningGames(remainingRunning);
      walletUpdate();
    });
    io.on("startAcepptor", (data) => {
      // console.log('startAcepptor',data)
      let owenedCreated = [],
        remainingGame = [];
      data.forEach(function (ele) {
        if (ele.Created_by)
          if (
            ele.Created_by._id == userID.current &&
            (ele.Status == "new" || ele.Status == "requested")
          ) {
            owenedCreated.push(ele);
          } else {
            remainingGame.push(ele);
          }
      });
      setCreated(owenedCreated);
      setallgame(remainingGame);
      walletUpdate();
    });

    io.on("acceptor_seen", (data) => {
      // console.log('acceptor_seen',data)
      let owenedCreated = [],
        remainingGame = [];
      data.openBattle.forEach(function (ele) {
        if (ele.Created_by)
          if (
            ele.Created_by._id == userID.current &&
            (ele.Status == "new" || ele.Status == "requested")
          ) {
            owenedCreated.push(ele);
          } else {
            remainingGame.push(ele);
          }
      });
      setCreated(owenedCreated);
      setallgame(remainingGame);
      let owenedRunning = [],
        remainingRunning = [];
      data.runningBattle.forEach(function (ele) {
        if (ele.Created_by && ele.Accepetd_By)
          if (
            ele.Created_by._id == userID.current ||
            ele.Accepetd_By._id == userID.current
          ) {
            owenedRunning.push(ele);
          } else {
            remainingRunning.push(ele);
          }
      });
      setOwnRunning(owenedRunning);
      setRunningGames(remainingRunning);
      walletUpdate();
    });
  }, [io]);

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    access_token = localStorage.getItem("token");
    if (!access_token) {
      window.location.reload();
      setTimeout(() => {
        //  history.push("/login")
      }, 500);
    }
    role();
    if (mount) {
      Allgames();
      runningGame();
    }
    return () => {
      role();
    };
  }, [mount]);
  //accept Challange

  const AcceptChallang = (id) => {
    if (str == 1) {
      Swal.fire({
        title: "Other request in process",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
    str = 1;
    const access_token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    // io.emit('acceptChalange', {
    //   Accepetd_By: headers,
    //   Acceptor_by_Creator_at: Date.now()
    //  })
    axios
      .put(
        `${EndPoint}/challange/accept/${id}`,
        {
          Accepetd_By: headers,
          Acceptor_by_Creator_at: Date.now(),
        },
        {
          headers,
        }
      )
      .then((res) => {
        setGameData({
          accept_by: res.data.Accepetd_By,
          created_by: res.data.Created_by,
        });

        str = 0;
        if (res.data.status === false) {
          Swal.fire({
            title: res.data.msg,
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        if (res.data.msg === "you have already enrolled") {
          Swal.fire({
            title: "You have already enrolled",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        if (res.data.msg === "Insufficient balance") {
          Swal.fire({
            title: "Insufficient balance",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          // Allgames(res.data)
        }
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
            //  history.push("/login")
          }, 500);
        }
        if (e.response.status == 400 || e.response.status == 429) {
          Swal.fire({
            title: "Please refresh!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  //reject Game
  const RejectGame = (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .put(
        `${EndPoint}/challange/reject/${id}`,
        {
          Accepetd_By: null,
          Status: "new",
          Acceptor_by_Creator_at: null,
        },
        { headers }
      )
      .then((res) => {
        // io.emit("gameRejected");
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
            //  history.push("/login")
          }, 500);
        }
        if (e.response.status == 400 || e.response.status == 429) {
          Swal.fire({
            title: "Please refresh!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  //delete
  const deleteChallenge = (_id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .delete(`${EndPoint}/challange/delete/${_id}`, {
        headers,
      })
      .then((res) => {
        if (res.data.status == false) {
          Swal.fire({
            title: res.data.msg,
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        // io.emit("deleteGame", _id);
      })
      .catch((e) => {
        if (e?.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
            //  history.push("/login")
          }, 500);
        }
        if (e.response.status == 400 || e.response.status == 429) {
          Swal.fire({
            title: "Please refresh!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  ///challange/running/update/

  const updateChallenge = (_id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .put(
        `${EndPoint}/challange/running/update/${_id}`,
        {
          Acceptor_seen: true,
        },
        { headers }
      )
      .then((res) => {
        // io.emit("game_seen");
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          setTimeout(() => {
            //  history.push("/login")
          }, 500);
        }
        if (e.response.status == 400 || e.response.status == 429) {
          Swal.fire({
            title: "Please refresh!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        console.log(e);
      });
  };

  // const [roomCode, setRoomCode] = useState()

  const getPost = async (Id) => {
    if (
      game_type === "Ludo Classics" ||
      game_type === "Ludo 1 Goti" ||
      game_type === "Ludo Ulta" ||
      game_type === "Ludo Host"
    ) {
      if (submitProcess) {
        setProcess(false);
        setChallangeReqRun(true);
        const access_token = localStorage.getItem("token");
        const headers = {
          authorization: `Bearer ${access_token}`,
        };
        axios
          .patch(
            `${EndPoint}/challange/requested/running/${game_type}/` + Id,
            {},
            { headers }
          )
          .then((res) => {
            setProcess(true);
            setChallangeReqRun(false);
            if (res.data.status == false) {
              Swal.fire({
                title: res.data.msg,
                icon: "warning",
                confirmButtonText: "OK",
              });
            } else {
              localStorage.setItem("timeOver", "timeStart");
              history.push(`/viewgame1/${Id}`, {
                prevPath: window?.location?.pathname,
              });
            }
          })
          .catch((e) => {
            setProcess(true);
            setChallangeReqRun(false);
            if (e?.response?.status == 401) {
              Swal.fire({
                title: "Somthing wrong",
                icon: "warning",
                confirmButtonText: "OK",
              });
            } else {
              Swal.fire({
                title: "Please refresh!",
                icon: "warning",
                confirmButtonText: "OK",
              });
            }
          });
      }
      // io.emit('roomCode', { game_id: Id, status: 'running' })
      // } else if (game_type === "Ludo Popular") {
      // io.emit('popularroomCode', { game_id: Id, status: 'running' })
    } else if (
      game_type === "LudoSnake" ||
      game_type === "Ludo Popular" ||
      game_type === "ludoClassicManual"
    ) {
      if (submitProcess) {
        setProcess(false);
        setChallangeReqRun(true);

        const access_token = localStorage.getItem("token");

        const headers = {
          authorization: `Bearer ${access_token}`,
        };

        axios
          .patch(
            `${EndPoint}/challange/requested/running/` + Id,
            {},
            { headers }
          )
          .then((res) => {
            setProcess(true);
            setChallangeReqRun(false);
            if (res.data.status == false) {
              Swal.fire({
                title: res.data.msg,
                icon: "warning",
                confirmButtonText: "OK",
              });
            } else {
              localStorage.setItem("timeOver", "timeStart");
              history.push(`/viewgame1/${Id}`, {
                prevPath: window?.location?.pathname,
              });
            }
          })
          .catch((e) => {
            setProcess(true);
            setChallangeReqRun(false);
            if (e?.response?.status == 401) {
              Swal.fire({
                title: "Somthing wrong",
                icon: "warning",
                confirmButtonText: "OK",
              });
            } else {
              Swal.fire({
                title: "Please refresh!",
                icon: "warning",
                confirmButtonText: "OK",
              });
            }
          });
      }
    }
  };

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
      <div className="leftContainer" style={{ minHeight: "100vh" }}>
        <div className="pt-5 mt-5 Orher_page_main_section">
          {/* <div class="home_message_div">
            <p class="">{siteSetting?.site_message}</p>
          </div> */}

          {/* {JSON.parse(localStorage.getItem("sitSetting")) == "undefined" ? (
            ""
          ) : JSON.parse(localStorage.getItem("sitSetting"))?.gameSearch ==
            true ? (
            <>
              <span className={`${css.cxy} ${css.battleInputHeader} mt-4`}>
                Create a Battle!
              </span>

              <div className="mx-auto d-flex my-2 w-50">
                <div>
                  <input
                    className={css.formControl}
                    type="tel"
                    placeholder="Amount"
                    value={Game_Ammount}
                    onChange={(e) => setGame_Ammount(e.target.value)}
                  />
                </div>
                <div className="set ml-1 ">
                  {" "}
                  {!isLoading ? (
                    <button
                      className={`bg-green ${css.playButton} cxy m-1 position-static `}
                      style={{ margin: "20px !important" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setGame_Ammount("");

                        ChallengeCreate();
                      }}
                    >
                      Set
                    </button>
                  ) : (
                    <button
                      className={`bg-green ${css.playButton} cxy m-1 position-static `}
                      disabled
                    >
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Loading...
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            ""
          )} */}
          <>
            <span className={`${css.cxy} ${css.battleInputHeader} mt-4`}>
              Create a Battle!
            </span>

            <div className="mx-auto d-flex my-2 w-50">
              <div>
                <input
                  className={css.formControl}
                  type="tel"
                  placeholder="Amount"
                  value={Game_Ammount}
                  onChange={(e) => setGame_Ammount(e.target.value)}
                />
              </div>
              <div className="set ml-1 ">
                {" "}
                {!isLoading ? (
                  <button
                    className={`bg-green ${css.playButton} cxy m-1 position-static `}
                    style={{ margin: "20px !important" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setGame_Ammount("");

                      ChallengeCreate();
                    }}
                  >
                    Set
                  </button>
                ) : (
                  <button
                    className={`bg-green ${css.playButton} cxy m-1 position-static `}
                    disabled
                  >
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Loading...
                  </button>
                )}
              </div>
            </div>
          </>
          <div className={css.dividerX}></div>

          <div className="px-4 py-3">
            <div className="mb-3">
              <img
                src={process.env.PUBLIC_URL + "/Images/Homepage/battleIcon.png"}
                alt=""
                width="20px"
              />
              <span className={`ml-2 ${css.gamesSectionTitle}`}>
                Open Battles
              </span>
              <span
                className={`${css.gamesSectionHeadline} text-uppercase position-absolute mt-2 font-weight-bold`}
                style={{ right: "1.5rem" }}
              >
                Rules
                <NavLink to="/Rules">
                  <img
                    className="ml-2"
                    src={process.env.PUBLIC_URL + "/Images/Homepage/info.png"}
                    alt=""
                  />
                </NavLink>
              </span>
            </div>

            {created &&
              created.map(
                (allgame) =>
                  allgame.Game_type == game_type && (
                    <BetCard
                      key={allgame._id}
                      allgame={allgame}
                      user={user}
                      deleteChallenge={deleteChallenge}
                      getPost={getPost}
                      RejectGame={RejectGame}
                      challangeReqRun={challangeReqRun}
                      winnAmount={winnAmount}
                      AcceptChallang={AcceptChallang}
                      updateChallenge={updateChallenge}
                    />
                  )
              )}
            {allgame &&
              allgame.map(
                (allgame) =>
                  (allgame.Status == "new" ||
                    (allgame.Status == "requested" &&
                      (user == allgame.Created_by._id ||
                        user == allgame?.Accepetd_By?._id)) ||
                    (allgame?.Status == "running" &&
                      user == allgame?.Accepetd_By?._id &&
                      allgame.Acceptor_seen == false)) &&
                  allgame.Game_type == game_type && (
                    <BetCard
                      key={allgame._id}
                      allgame={allgame}
                      user={user}
                      deleteChallenge={deleteChallenge}
                      getPost={getPost}
                      RejectGame={RejectGame}
                      winnAmount={winnAmount}
                      AcceptChallang={AcceptChallang}
                      updateChallenge={updateChallenge}
                    />
                  )
              )}
          </div>
          <div className={css.dividerX}></div>
          <div className="px-4 py-3">
            <div className="mb-2">
              <img
                src={process.env.PUBLIC_URL + "/Images/Homepage/battleIcon.png"}
                alt=""
                width="20px"
              />
              <span className={`ml-2 ${css.gamesSectionTitle}`}>
                Running Battles
              </span>
            </div>
            {ownRunning &&
              ownRunning.map((runnig) => {
                if (
                  ((user == runnig.Accepetd_By._id
                    ? (runnig.Status === "running" &&
                        user == runnig.Accepetd_By._id &&
                        runnig.Acceptor_seen == true) ||
                      runnig.Status === "pending"
                    : (runnig.Status === "running" &&
                        user == runnig.Created_by._id) ||
                      runnig.Status === "pending") ||
                    runnig.Status == "conflict") &&
                  runnig.Game_type == game_type
                )
                  return (
                    <RunningCard
                      key={runnig._id}
                      runnig={runnig}
                      user={user}
                      winnAmount={winnAmount}
                    />
                  );
              })}

            {runningGames &&
              runningGames.map((runnig) => {
                if (
                  (user == runnig.Accepetd_By._id ||
                  user == runnig.Created_by._id
                    ? user == runnig.Accepetd_By._id
                      ? (runnig.Status === "running" &&
                          user == runnig.Accepetd_By._id &&
                          runnig.Acceptor_seen == true) ||
                        (runnig.Status === "pending" &&
                          runnig.Acceptor_status == null)
                      : (runnig.Status === "running" &&
                          user == runnig.Created_by._id) ||
                        (runnig.Status === "pending" &&
                          runnig.Creator_Status == null)
                    : runnig.Status === "running" ||
                      runnig.Status === "pending") &&
                  runnig.Game_type == game_type
                ) {
                  return (
                    <>
                      <RunningCard
                        key={runnig._id}
                        runnig={runnig}
                        user={user}
                        winnAmount={winnAmount}
                      />
                    </>
                  );
                }
              })}
          </div>
        </div>

        {/* <section
           className='Challenges_main_section'
           style={{ minHeight: '100vh' }}
         >
           <div>
             <h2 className='challange_heading'> Challenges</h2>
           </div>
           {gameList.map(item => (
             <div className='Challenges_single_box_main'>
               <div className='top__heading'>
                 <h3>
                   <span> Currently Playing:</span>{' '}
                   <span>{countData(item) ? countData(item).count : 0}</span>
                 </h3>
                 <h3>
                   {WaitingGameData(item) ? (
                     <>
                       <span>{WaitingGameData(item).count}</span>
                       <span> Waiting Now</span>
                     </>
                   ) : (
                     ''
                   )}
                 </h3>
               </div>
               <div className='Challenges_single_box_inner'>
                 <div className='Challenges_single_box_img'>
                   {' '}
                   <img
                     src='/Images/icons/cup.png'
                     className='img-fluid'
                     alt='img'
                   />{' '}
                   <h4> {item}</h4>
                 </div>
                 <Link to='#' className='play_btn'>
                   {countData(item)?.users[0].Accepetd_By == user ||
                   countData(item)?.users[0].Created_by == user ||
                   WaitingGameData(item)?.users[0].users == user ? (
                     <>
                       <span
                         onClick={() =>
                           loadGame(
                             WaitingGameData(item)?.users[0]._id
                               ? WaitingGameData(item)?.users[0]._id
                               : countData(item)?.users[0]._id
                           )
                         }
                       >
                         View
                       </span>
                     </>
                   ) : (
                     <>
                       <span onClick={() => ChallengeCreate(item)}>Play</span>
                     </>
                   )}
                 </Link>
               </div>
             </div>
           ))}
         </section> */}
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </>
  );
}
