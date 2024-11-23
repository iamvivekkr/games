import React, { useEffect, useState, useRef } from "react";
import "../css/viewGame1.css";
import "../css/layout.css";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import css from "../css/Pan.module.css";
import Rightcontainer from "../Components/Rightcontainer";
import Swal from "sweetalert2";
import "../css/Loader.css";
import io from "../Components/socket";
import Compressor from "compressorjs";
const EndPoint = process.env.REACT_APP_API_URL;
export default function ViewGame1(props) {
  const history = useHistory();

  const location = useLocation();
  const path = location?.pathname?.split("/")[2];
  const [Game, setGame] = useState("0");
  const [status, setStatus] = useState(null);
  const [fecthStatus, setFecthStatus] = useState();
  const [scrnshot, setScrnshot] = useState(null);
  const [scrnshot1, setScrnshot1] = useState("");
  const [initialRoom, setInitialRoom] = useState("");
  const [reason, setReason] = useState(null);

  const [roomcode, setRoomcode] = useState();
  let submitReq = useRef(false);
  const isMounted = useRef(true);

  const [submitProcess, setProcess] = useState(true);
  useEffect(() => {
    io.on("updateroomcode", (data) => {
      getCode();
      // console.log("data",data)
    });
  }, [initialRoom.Room_code == 0]);

  // useEffect(()=>{
  //   if(Game?.Accepetd_By?._id == user && Game.Room_code=="0"){
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 10000);
  //   }
  // },[])
  // const [counter, setCounter] = React.useState(60)

  // React.useEffect(() => {
  //   if (Game?.Accepetd_By?._id == user) {
  //     counter > 0 &&
  //       setTimeout(() => {
  //         setCounter(counter - 1)
  //       }, 1000)
  //   }
  // }, [counter])

  useEffect(() => {
    getCode();
  }, []);
  const getPost = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .patch(
        `${EndPoint}/challange/roomcode/${path}`,
        {
          Room_code: roomcode,
        },
        { headers }
      )
      .then((res) => {
        setGame(res.data);
        // io.emit('challengeOngoing')
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });
  };
  /// user details start

  const [user, setUser] = useState();
  const [userAllData, setUserAllData] = useState();

  const role = async () => {
    const access_token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios
      .get(`${EndPoint}/me`, { headers })
      .then((res) => {
        setUser(res.data._id);
        setUserAllData(res.data);
        // // console.log(res.data._id)
        Allgames(res.data._id);
        //getCode();
        getCode(res.data._id);
        // setTimeout(() => {
        // }, 1000);
        // checkExpire();
        // if(!res.data.Room_join)
        // {
        // }
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });
  };

  /// user details end

  const [ALL, setALL] = useState();

  const Allgames = async (userId) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios
      .get(`${EndPoint}/challange/${path}`, { headers })
      .then((res) => {
        if (res.data.Status == "new" || res.data.Status == "requested") {
          setTimeout(async () => {
            await axios
              .get(`${EndPoint}/challange/${path}`, { headers })
              .then((res) => {
                if (
                  res.data.Status == "new" ||
                  res.data.Status == "requested"
                ) {
                  history.push(props.location.state.prevPath);
                } else {
                  setProcess(false);
                }
              })
              .catch((error) => {
                console.error(error);
                history.push(props.location.state.prevPath);
              });
          }, 10000);
        } else {
          setProcess(false);
        }
        setALL(res.data);
        setGame(res.data);
        // // console.log(res.data.Accepetd_By._id)
        if (userId == res.data.Accepetd_By._id)
          setFecthStatus(res.data.Acceptor_status);

        if (userId == res.data.Created_by._id)
          setFecthStatus(res.data.Creator_Status);
      })
      .catch((e) => {
        if (e.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });
  };
  const getCode = async (userId) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios
      .get(`${EndPoint}/game/roomcode/get/${path}`, { headers })
      .then((res) => {
        //setALL(res.data)
        setInitialRoom(res.data);
        Allgames(userId);
        if (res.data.Accepetd_By == user && res.data.Room_code == 0) {
          setTimeout(async () => {
            window.location.reload();
          }, 10000);
        }
      });
  };
  const checkExpire = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios
      .get(`${EndPoint}/game/roomcode/expire/${path}`, {
        headers,
      })
      .then((res) => {
        history.goBack();
      });
  };

  useEffect(() => {}, [io]);

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    access_token = localStorage.getItem("token");
    if (!access_token) {
      window.location.reload();
      history.push("/login");
    }
    // console.log(history.location)

    role();
  }, []);

  const clearImage = (e) => {
    setScrnshot1(null);
    setScrnshot(null);
    setStatus(null);
  };
  // Result

  const Result = async (e) => {
    e.preventDefault();
    if (submitReq.current == false) {
      submitReq.current = true;
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      if (status) {
        setProcess(true);
        const formData = new FormData();
        formData.append("file", scrnshot);
        formData.append("status", status);
        if (status == "cancelled") {
          formData.append("reason", reason);
        }

        await axios({
          method: "post",
          url: `${EndPoint}/challange/result/${path}`,
          data: formData,
          headers: headers,
        })
          .then((res) => {
            io.emit("resultAPI");
            // socket.emit('resultAPI');
            submitReq.current = false;
            setProcess(false);
            history.push(props.location.state.prevPath);
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
      } else {
        submitReq.current = false;
        alert("please fill all field or Re-Select result status");
      }
    }
  };

  const copyCode = (e) => {
    // console.log(Game.Room_code);
    navigator.clipboard.writeText(Game.Room_code);

    Swal.fire({
      position: "center",
      icon: "success",
      type: "success",
      title: "Room Code Copied",
      showConfirmButton: false,
      timer: 1200,
    });
  };
  const Completionist = () => <span>You are good to go!</span>;

  // ADDED BY TEAM
  const handleChange = (e) => {
    setScrnshot1(URL.createObjectURL(e.target.files[0]));
    const image = e.target.files[0];
    // console.log("orignal",image.size/1000>300)
    if (image && image.size / 1000 > 300) {
      console.log(" compression");
      new Compressor(image, {
        quality: 0.6,
        success(compressedResult) {
          // console.log(compressedResult)
          if (compressedResult) {
            setScrnshot(compressedResult);
          } else {
            setScrnshot(image);
          }
        },
      });
    } else {
      console.log("no compression");
      setScrnshot(e.target.files[0]);
    }
  };
  const [siteSetting, setsiteSetting] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("sitSetting"));
    if (items) {
      setsiteSetting(items);
    }
  }, []);

  // -----Start timer ------------------------------------------------------------------------
  const [showDiv, setShowDiv] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(null);

  // Replace this with the actual timestamp from MongoDB
  const createdAtTimestamp = new Date(Game.createdAt).getTime(); // Example timestamp

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const currentTime = new Date().getTime();
      const differenceInSeconds = Math.floor(
        (currentTime - createdAtTimestamp) / 1000
      );
      //  console.log(differenceInSeconds,showDiv)
      if (differenceInSeconds >= 240) {
        setShowDiv(false);
      } else {
        setSecondsRemaining(240 - differenceInSeconds);
      }
    };

    calculateTimeRemaining(); // Calculate initial time remaining

    // Update time remaining every second
    const timer = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [createdAtTimestamp]);

  // -----end timer------
  const handleSetRoomCode = () => {
    const inputValue = roomcode;

    if (
      /^[0-9]+$/.test(inputValue) &&
      inputValue.length === 8 &&
      inputValue[0] === "0"
    ) {
      getPost();
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please enter a valid 8-digit code that starts with 0.",
        showConfirmButton: true,
      });
    }
  };
  return (
    <>
      <Header user={userAllData} />
      {/* {!Game && <div class="lds-ripple"><div></div><div></div></div>} */}
      {Game && (
        <div className="leftContainer">
          <div className="pt-5 mt-5 Orher_page_main_section">
            <div class="home_message_div">
              <p class="">
                गेम जीतने के बाद गेम हिस्ट्री पर क्लिक करके "ROOMCODE" वाला
                SCREENSHOT अनिवार्य होगा उसके लिए आपको "MATCH HISTORY" मे जाके
                अनलॉक करके यहा अपडेट करें All the Best🤞
              </p>
            </div>
            {!Boolean(submitProcess) && (
              <div className="battleCard-bg">
                <div className="battleCard">
                  <div className="players cxy pt-2">
                    <div className="flex-column cxy">
                      <h5>{Game.Created_by && Game.Created_by.Name}</h5>
                      {Game?.Created_by?.avatar ? (
                        <img
                          src={`${EndPoint}/${Game.Created_by.avatar}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${EndPoint}/user.png`;
                          }}
                          width="50px"
                          height="50px"
                          alt=""
                          style={{
                            borderTopLeftRadius: "50%",
                            borderTopRightRadius: "50%",
                            borderBottomRightRadius: "50%",
                            borderBottomLeftRadius: "50%",
                          }}
                        />
                      ) : (
                        <img
                          src="/images/avatars/Avatar1.png"
                          width="50px"
                          height="50px"
                          alt="user"
                          style={{ borderRadius: "50%" }}
                        />
                      )}
                    </div>
                    <img
                      className="mx-3"
                      src={
                        process.env.PUBLIC_URL + "/images/Homepage/versus.png"
                      }
                      width="23px"
                      alt=""
                    />
                    <div className="flex-column cxy ">
                      <h5> {Game?.Accepetd_By && Game?.Accepetd_By.Name}</h5>
                      {Game?.Accepetd_By?.avatar ? (
                        <img
                          src={`${EndPoint}/${Game.Accepetd_By.avatar}`}
                          width="50px"
                          height="50px"
                          alt=""
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
                          width="50px"
                          height="50px"
                          alt="user"
                          style={{ borderRadius: "50%" }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="amount cxy mt-2">
                    <span style={{ opacity: "0.8" }}>Playing for</span>
                    <img
                      className="mx-1"
                      src={
                        process.env.PUBLIC_URL +
                        "/Images/LandingPage_img/global-rupeeIcon.png"
                      }
                      width="25x"
                      alt=""
                    />
                    <span
                      style={{
                        fontSize: "1.2em",
                        fontWeight: 700,
                        opacity: "0.8",
                      }}
                    >
                      {Game.Game_Ammount}
                    </span>
                  </div>
                  <div className="thin-divider-x my-3" />

                  <div className="battle_card_main">
                    {(Game.Room_code == null && (
                      <div className=" cxy flex-column">
                        <h6 className="headings"> Waiting for Room Code... </h6>
                        <h6 className="headings">रूम कोड का इंतजार है।</h6>
                        <div className="lds-spinner">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    )) ||
                      (Game.Room_code != "0" && (
                        <div className=" cxy ">
                          <div className="">
                            <h2 className="profile_headings mb-0 mr-3">
                              Room Code <span>{Game.Room_code}</span>
                            </h2>
                          </div>
                          <button
                            className="bg-green playButton position-static mt-0"
                            onClick={(e) => copyCode(e)}
                          >
                            Copy Code
                          </button>
                        </div>
                      )) ||
                      (Game.Room_code == "0" &&
                        ((Game.Created_by._id == user &&
                          Game.Room_code == "0" && (
                            <div className=" cxy flex-column">
                              <>
                                {showDiv ? (
                                  <div className=" cxy flex-column">
                                    <h6 className="headings">
                                      {" "}
                                      Set Room Code{" "}
                                    </h6>
                                    <h6 className="headings">
                                      लूडो किंग से रूम कोड अपलोड करें
                                    </h6>

                                    <input
                                      type="number"
                                      className="form-control mt-1 w-75"
                                      style={{
                                        backgroundColor: "#e8eeee",
                                        border: "1px solid red",
                                      }}
                                      value={roomcode}
                                      onChange={(e) =>
                                        setRoomcode(e.target.value)
                                      }
                                    />
                                    <button
                                      className="bg-green playButton position-static mt-2"
                                      type="button"
                                      onClick={handleSetRoomCode}
                                    >
                                      SET ROOM CODE
                                    </button>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </>

                              <div
                                className="pt-4 text-primary"
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "20px",
                                }}
                              >
                                {showDiv ? (
                                  <div>
                                    <p>
                                      Remaining Time :{" "}
                                      <span style={{ fontSize: "30px" }}>
                                        {" "}
                                        {secondsRemaining}{" "}
                                      </span>
                                      seconds
                                    </p>
                                  </div>
                                ) : (
                                  <div>
                                    <p style={{ color: "red" }}>
                                      Your Time is Complete please Reset bettel
                                      !
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="rules">
                                <ol className="list-group list-group-numbered">
                                  <li
                                    className="list-group-item"
                                    style={{
                                      color: "red",
                                      fontSize: "20px !important",
                                    }}
                                  >
                                    <marquee>
                                      कृपया लूडो किंग से रुम कोड निकल कर SET
                                      ROOM CODE मे डाल दे 
                                    </marquee>
                                  </li>
                                </ol>
                              </div>
                            </div>
                          )) ||
                          (Game.Accepetd_By._id == user &&
                            Game?.Room_code == "0" && (
                              <div className="roomCode cxy flex-column">
                                <>
                                  {showDiv ? (
                                    <>
                                      <div
                                        style={{
                                          textAlign: "center",
                                          marginBottom: "10px",
                                        }}
                                      >
                                        <h6 className="headings">
                                          {" "}
                                          Waiting for Room Code{" "}
                                        </h6>
                                        <h6 className="headings">
                                          रूम कोड का इंतजार है। [
                                          {secondsRemaining}]
                                        </h6>

                                        <div className="lds-spinner">
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                          <div></div>
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div>
                                      <p style={{ color: "red" }}>
                                        Your Time is Complete please Reset
                                        bettel !
                                      </p>
                                    </div>
                                  )}
                                </>

                                <div className="rules">
                                  <ol className="list-group list-group-numbered">
                                    <li
                                      className="list-group-item"
                                      style={{
                                        color: "red",
                                        fontSize: "20px !important",
                                      }}
                                    >
                                      <marquee>
                                        {" "}
                                        कृपया इंतजार करे सामने वाला यूजर लूडो
                                        किंग से रूम कोड निकल कर दे रहा  है{" "}
                                      </marquee>
                                    </li>
                                  </ol>
                                </div>
                              </div>
                            ))))}
                  </div>

                  {/* <div className="cxy app-discription flex-column">
                    <span style={{ opacity: ".8" }}>
                      {" "}
                      Play ludo game in Ludo King App
                    </span>
                    <div className="mt-2">
                      <a
                        href="https://play.google.com/store/apps/details?id=com.ludo.king"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="mr-2"
                          src={
                            process.env.PUBLIC_URL + "/Images/google-play.jpeg"
                          }
                          width="128px"
                          height="38px"
                          alt=""
                        />
                      </a>
                      <a
                        href="https://itunes.apple.com/app/id993090598"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={
                            process.env.PUBLIC_URL + "/Images/app-store.jpeg"
                          }
                          width="128px"
                          height="38px"
                          alt=""
                        />
                      </a>
                    </div>
                  </div> */}
                  <div className="thin-divider-x my-3" />
                  <div className="rules">
                    <span className="cxy mb-1">
                      <u>Game Rules</u>
                    </span>
                    <ol className="list-group list-group-numbered">
                      <li className="list-group-item">
                        Record every game while playing.
                      </li>
                      <li className="list-group-item">
                        For cancellation of game, video proof is necessary.
                      </li>
                      <li className="list-group-item">
                        {/* <img
                      className='mx-1'
                      src={process.env.PUBLIC_URL + 'Images/LandingPage_img/global-rupeeIcon.png'}
                      width='21px'
                      alt=''
                    /> */}
                        <h6 className="d-none  text-danger d-block text-center">
                          ◉ महत्वपूर्ण नोट:कृपया गलत गेम परिणाम अपलोड न करें,
                          अन्यथा आपके वॉलेट बैलेंस पर penalty लगाई जायगी। गलत
                          रिजल्ट अपडेट करने पर 50 रुपये पेनल्टी लगेगी।
                        </h6>
                      </li>
                      <li className="list-group-item">
                        {/* <img
                      className='mx-1'
                      src={process.env.PUBLIC_URL + 'Images/LandingPage_img/global-rupeeIcon.png'}
                      width='21px'
                      alt=''
                    /> */}
                        <h6 className="d-none  text-danger d-block text-center">
                          महत्वपूर्ण नोट: यदि आप गेम के परिणामों को अपडेट नहीं
                          करते हैं, तो आपके वॉलेट बैलेंस पर जुर्माना लगाया
                          जाएगा। रिजल्ट अपडेट नहीं करने पर 25 रुपये पेनल्टी
                          लगेगी।
                        </h6>
                      </li>
                    </ol>
                  </div>
                  <div className="match-status-border row">
                    <div className="col-6">Match Status</div>
                  </div>
                  <form
                    className="result-area"
                    onSubmit={(e) => {
                      Result(e);
                    }}
                    encType="multipart/form-data"
                  >
                    {fecthStatus !== null && fecthStatus !== undefined && (
                      <p>
                        You have already updated your battle result for{" "}
                        <h6 className="d-inline-block text-uppercase">
                          <b>{fecthStatus}</b>
                        </h6>
                      </p>
                    )}
                    {fecthStatus === null && (
                      <>
                        {" "}
                        <p>
                          After completion of your game, select the status of
                          the game and post your screenshot below.
                        </p>
                        <div
                          className="MuiFormGroup-root radios"
                          role="radiogroup"
                          aria-label="Result"
                        >
                          <label className="MuiFormControlLabel-root hidden Mui-disabled">
                            <span
                              className="MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root MuiRadio-colorSecondary jss2 Mui-checked jss3 Mui-disabled MuiIconButton-colorSecondary Mui-disabled Mui-disabled"
                              tabIndex={-1}
                              aria-disabled="true"
                            >
                              <span className="MuiIconButton-label">
                                <input
                                  className="jss4 mr-2"
                                  name="battleResult"
                                  type="radio"
                                  defaultValue="select"
                                  defaultChecked
                                  style={{ transform: "scale(1.5)" }}
                                />
                              </span>
                            </span>
                            <span
                              className="MuiTypography-root MuiFormControlLabel-label Mui-disabled MuiTypography-body1"
                              style={{ marginTop: "3px" }}
                            >
                              (Disabled option)
                            </span>
                          </label>
                          <label className="MuiFormControlLabel-root">
                            <span
                              className="MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root jss8"
                              aria-disabled="false"
                            >
                              <span className="MuiIconButton-label">
                                <input
                                  className="jss4 mr-2"
                                  name="battleResult"
                                  type="radio"
                                  defaultValue="winn"
                                  onClick={(e) => setStatus("winn")}
                                  style={{ transform: "scale(1.5)" }}
                                />
                              </span>
                              <span className="MuiTouchRipple-root" />
                            </span>
                            <span
                              className="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                              style={{ marginTop: "3px" }}
                            >
                              I Won
                            </span>
                          </label>
                          <label className="MuiFormControlLabel-root">
                            <span
                              className="MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root MuiRadio-colorSecondary MuiIconButton-colorSecondary"
                              aria-disabled="false"
                              root="[object Object]"
                            >
                              <span className="MuiIconButton-label">
                                <input
                                  className="jss4 mr-2"
                                  name="battleResult"
                                  type="radio"
                                  defaultValue="lose"
                                  onClick={() => {
                                    setStatus("lose");
                                    alert(
                                      "Are you sure You Lost? क्या आप सुनिश्चित हैं कि आप हार गए हैं?"
                                    );
                                  }}
                                  style={{ transform: "scale(1.5)" }}
                                />
                              </span>
                              <span className="MuiTouchRipple-root" />
                            </span>
                            <span
                              className="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                              style={{ marginTop: "3px" }}
                            >
                              I Lost
                            </span>
                          </label>
                          <label className="MuiFormControlLabel-root">
                            <span
                              className="MuiButtonBase-root MuiIconButton-root jss1 MuiRadio-root"
                              aria-disabled="false"
                            >
                              <span className="MuiIconButton-label">
                                <input
                                  className="jss4 mr-2"
                                  name="battleResult"
                                  type="radio"
                                  defaultValue="cancelled"
                                  onClick={() => {
                                    setStatus("cancelled");
                                    alert(
                                      "Are you sure you want to cancel? क्या आप वाकई इसे रद्द करना चाहते हैं?"
                                    );
                                  }}
                                  style={{ transform: "scale(1.5)" }}
                                />
                              </span>
                              <span className="MuiTouchRipple-root" />
                            </span>
                            <span
                              className="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"
                              style={{ marginTop: "3px" }}
                            >
                              Cancel
                            </span>
                          </label>
                        </div>
                      </>
                    )}
                    {status !== null &&
                      status !== "cancelled" &&
                      status !== "lose" && (
                        <div className={`${css.doc_upload} mt-5`}>
                          {/* <input type="file" onChange={(e) => setScrnshot(e.target.files[0])} accept="image/*" required /> */}
                          {/* ADDED BY TEAM */}
                          <input
                            type="file"
                            onChange={handleChange}
                            accept="image/*"
                            required
                          />
                          {/* ADDED BY TEAM */}
                          {!scrnshot && (
                            <div className="cxy flex-column position-absolute ">
                              <i class="fa-solid fa-arrow-up"></i>
                              {/* <img src={process.env.PUBLIC_URL + '/Images/upload_icon.png'} width="17px" alt="" className="snip-img" /> */}
                              <div className={`${css.sideNav_text} mt-2 `}>
                                Upload screenshot.
                              </div>
                            </div>
                          )}
                          {scrnshot && (
                            <div className={css.uploaded}>
                              <img
                                src="/images/file-icon.png"
                                width="26px"
                                alt=""
                                style={{ marginRight: "20px" }}
                              />
                              <div
                                className="d-flex flex-column"
                                style={{ width: "80%" }}
                              >
                                <div className={`${css.name} `}>
                                  {scrnshot.name}
                                </div>
                                <div className={css.size}>
                                  {(scrnshot.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                              <div className="image-block">
                                <img
                                  src="/images/global-cross.png"
                                  width="10px"
                                  alt=""
                                  onClick={clearImage}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    {status !== null && status == "cancelled" && (
                      <div class="form-group">
                        <textarea
                          class="form-control border-secondary"
                          name=""
                          id=""
                          rows="3"
                          onChange={(e) => {
                            setReason(e.target.value);
                          }}
                          required
                        ></textarea>
                      </div>
                    )}

                    {/* ADDED BY TEAM */}
                    <div style={{ width: "100%" }}>
                      <img src={scrnshot1} style={{ width: "100%" }} />
                    </div>
                    {/* ADDED BY TEAM */}

                    {/* <button type='submit' className='btn btn-danger mt-3 text-white' id="post" onSubmit={(e) => { e.preventDefault(); Result() }}>Post Result</button> */}
                    {fecthStatus == null && fecthStatus == undefined && (
                      <input
                        type="submit"
                        className="btn btn-danger mt-3 text-white"
                        id="post"
                      />
                    )}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {Boolean(submitProcess) && (
        <div
          className="loaderReturn"
          style={{ zIndex: "99", minHeight: "100vh" }}
        >
          <img
            src={"/Images/LandingPage_img/loader1.gif"}
            style={{ width: "100%" }}
          />
        </div>
      )}
      <div class="divider-y"></div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </>
  );
}
