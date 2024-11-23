import React, { useEffect, useState } from "react";
import "../css/layout.css";
import css from "../css/Profile.module.css";
import { Link, useHistory } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import axios from "axios";
import socket from "../Components/socket";
// import { Link, useHistory } from 'react-router-dom';
// import Profile from './Profile';
// import { Image } from 'react-bootstrap';
import Rightcontainer from "../Components/Rightcontainer";
import Swal from "sweetalert2";
import Header from "../Components/Header";
import { IoIosLogOut } from "react-icons/io";
const Profile1 = () => {
  const [show, setShow] = useState(false);

  const [referral, setCode] = useState("");
  const [Id, setId] = useState(null);
  const [profile, setProfile] = useState();
  const [portcss, setPortcss] = useState(css.active_tab);
  const [portcss1, setPortcss1] = useState(css.inactive_tab);
  const [crushcss, setCrushcss] = useState(true);
  const [holder_name, setHolder_name] = useState();
  const [account_number, setAccount_number] = useState();
  const [ifsc_code, setIfsc_code] = useState();
  const [upi_id, setUpi_id] = useState();
  const history = useHistory();
  const EndPoint = process.env.REACT_APP_API_URL;
  const logout = () => {
    let access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        `${EndPoint}/logout`,
        {
          headers: headers,
        },
        { headers }
      )
      .then((res) => {
        // setUser(res.data)
        localStorage.removeItem("token");
        //window.location.reload();
        history.push("/login");
        window.location.reload(true);
      })
      .catch((e) => {
        // alert(e.msg)
      });
  };

  useEffect(() => {
    socket.on("setProfile", (data) => {
      // console.log(data)
      setProfile(data);
      setId(data._id);
      TotalGame(data._id);
      setName(data.Name);
      setCode(data.referral);
      setHolder_name(data.holder_name);
      setAccount_number(data.account_number);
      setIfsc_code(data.ifsc_code);
      setUpi_id(data.upi_id);
    });
  });

  const UserALL = () => {
    let access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(`${EndPoint}/me`, { headers })
      .then((res) => {
        setProfile(res.data);
        setId(res.data._id);
        TotalGame(res.data._id);
        setName(res.data.Name);
        setCode(res.data.referral);
        setHolder_name(res.data.holder_name);
        setAccount_number(res.data.account_number);
        setIfsc_code(res.data.ifsc_code);
        setUpi_id(res.data.upi_id);
      })
      .catch((e) => {
        // alert(e.msg)
      });
  };
  const [Name, setName] = useState();
  const UpdateProfile = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    const data = await axios
      .patch(
        `${EndPoint}/user/edit`,
        {
          Name,
        },
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data == "User name already exist!") {
          Swal.fire({
            title: res.data,
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          setName(res.data);
          UserALL();
        }
      });
  };
  const updateBankDetails = async (e) => {
    e.preventDefault();
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    const data = await axios
      .patch(
        `${EndPoint}/user/edit`,
        {
          holder_name,
          account_number,
          ifsc_code,
          upi_id,
        },
        { headers }
      )
      .then((res) => {
        console.log(res.data);
        if (res.status == 200) {
          setShow((prev) => !prev);
          UserALL();
          let message;
          message = res.data.msg;
          if (!res.data.msg) {
            message = "something went wrong";
          }
          Swal.fire({
            title: message,
            icon: res.data.submit ? "success" : "error",
            confirmButtonText: "OK",
          });
        }
      });
  };
  const update_RefCode = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    const data = await axios
      .patch(
        `${EndPoint}/user/edit`,
        {
          referral,
        },
        { headers }
      )
      .then((res) => {
        if (res.status == 200) {
          UserALL();
          let message;
          message = res.data.msg;
          if (!res.data.msg) {
            message = "Invalid referral Code";
          }
          Swal.fire({
            title: message,
            icon: res.data.submit ? "success" : "error",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((res) => {
        Swal.fire({
          title: res.response?.data?.msg,
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };
  //// total game
  const [total, setTotal] = useState();
  const TotalGame = (Id) => {
    let access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(`${EndPoint}/total/user/all/${Id}`, { headers })
      .then((res) => {
        setTotal(res.data);
      })
      .catch((e) => {});
  };

  const [pic, setPic] = useState();
  const Result = async (file) => {
    if (file) {
      const access_token = localStorage.getItem("token");
      // // console.log(access_token)
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      const formData = new FormData();
      formData.append("avatar", file);

      // console.log(formData)
      await fetch(`${EndPoint}/users/me/avatar`, {
        method: "POST",
        body: formData,
        headers,
      }).then((res) => {
        UserALL();
      });
    }
  };
  //avatar

  useEffect(() => {
    UserALL();
  }, []);

  return (
    <>
      <Header user={profile} />
      <div className="leftContainer" style={{ minHeight: "100vh" }}>
        <div className=" profile_top_box">
          <div className={`${css.center_xy} py-5`}>
            <div className="profile_top_box_inner_main">
              <label>
                <input
                  className="d-none"
                  // type="file"
                  // onChange={(e) => Result(e.target.files[0])}
                  accept="image/*"
                  required
                />
                <picture>
                  {/* {image} */}
                  {profile && profile.avatar ? (
                    <img
                      className="profile_img"
                      src={`${EndPoint}/${profile && profile.avatar}`}
                      alt=""
                      style={{ borderRadius: "50px" }}
                    />
                  ) : (
                    <img
                      className="profile_img"
                      src={`/user.png`}
                      alt=""
                      style={{ borderRadius: "50px" }}
                    />
                  )}
                </picture>
              </label>
              <div>
                <span className={`${css.battle_input_header} mr-1`}>
                  {profile && profile.Phone}
                </span>
                <div className={`text-bold  ${portcss}  profile_name`}>
                  {profile && profile.Name}
                  <img
                    className={` profile_edit_btn`}
                    width="20px"
                    src="/images/icon-edit.jpg"
                    alt=""
                    onClick={() => {
                      setPortcss(css.inactive_tab);
                      setPortcss1(css.active_tab);
                    }}
                  />
                </div>
                <div className={`text-bold my-3 ${portcss1}`}>
                  <div
                    className={`${css.MuiFormControl_root} ${css.MuiTextField_root}`}
                    style={{ verticalAlign: "bottom" }}
                  >
                    <div
                      className={`${css.MuiInputBase_root} ${css.MuiInput_root} ${css.MuiInput_underline} ${css.MuiInputBase_formControl} ${css.MuiInput_formControl}`}
                    >
                      <input
                        aria-invalid="false"
                        type="text"
                        maxLength={"20"}
                        className={`${css.MuiInputBase_input} ${css.MuiInput_input}`}
                        placeholder="Enter Username"
                        value={Name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <img
                    className="ml-2"
                    width="20px"
                    src="/images/select-blue-checkIcon.png"
                    alt=""
                    onClick={() => {
                      setPortcss(css.active_tab);
                      setPortcss1(css.inactive_tab);
                      UpdateProfile(Id);
                    }}
                  />
                </div>
              </div>
            </div>
            <Link className={`${css.profile_wallet} wallet_btn`} to="/wallet">
              <picture className="">
                <img width="32px" src="/images/icons/wallet.png" alt="" />
              </picture>
              <div className={`${css.mytext}  wallet_btn_text`}>My Wallet</div>
            </Link>
          </div>
        </div>
        {/* <div className={css.divider_x}></div> */}

        <div className=" grident_bg_two comptele_kyc_div">
          <div className={css.text_bold}>Complete Profile</div>
          <div className="">
            <div>
              <div>
                <div className="" style={{}}>
                  <Link
                    className={`d-flex align-items-center ${css.profile_wallet} wallet_btn`}
                    style={{ backgroundColor: "whitesmoke" }}
                    to={
                      (profile && profile.verified === `unverified`) ||
                      (profile && profile.verified === `reject`)
                        ? `/Kyc2`
                        : `/Profile`
                    }
                  >
                    <picture className="">
                      <img
                        width="32px"
                        src="/images/kyc-icon-new.png"
                        alt=""
                        className=""
                      />
                    </picture>
                    <div className={` ${css.mytext} wallet_btn_text`}>
                      {profile && profile.verified === `unverified`
                        ? "Complete KYC"
                        : profile && profile.verified === "pending"
                        ? "In Process"
                        : profile && profile.verified === "verified"
                        ? "Completed Kyc ✅"
                        : "KYC REJECT ❌"}{" "}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className={css.divider_x}></div> */}
        <div className="grident_bg">
          {profile && !profile.referral && (
            <div className="px-3 py-1 refereal_single_boxes_border">
              <div
                className={`d-flex align-items-center ${css.position_relative}`}
                style={{ height: "84px" }}
              >
                <picture>
                  <img
                    height="32px"
                    width="32px"
                    src={
                      process.env.PUBLIC_URL + "images/Header/sreferEarn.png"
                    }
                    alt=""
                    className="snip-img"
                  />
                </picture>
                <div className="pl-4">
                  <div
                    className={`${css.text_uppercase} ${css.moneyBox_header}`}
                    style={{ fontSize: "1rem" }}
                  >
                    Use Refer Code
                  </div>
                  <div className="d-flex">
                    <input
                      type="text"
                      className={css.MuiInputBase_input}
                      aria-describedby="basic-addon1"
                      value={referral}
                      onChange={(e) => {
                        setCode(e.target.value);
                      }}
                    />
                    <button
                      style={{ backgroundColor: "transparent", border: "none" }}
                      onClick={() => {
                        update_RefCode();
                      }}
                    >
                      <img
                        width="20px"
                        className="ml-2"
                        src="/images/select-blue-checkIcon.png"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="px-3 py-1 refereal_single_boxes_border">
            <div
              className={`d-flex align-items-center ${css.position_relative}`}
              style={{ height: "84px" }}
            >
              <picture>
                <img
                  height="32px"
                  width="32px"
                  src="/images/global-cash-won-green-circular.png"
                  alt=""
                  className="snip-img"
                />
              </picture>
              <div className="pl-4">
                <div
                  className={`${css.text_uppercase} ${css.moneyBox_header}`}
                  style={{ fontSize: "1em" }}
                >
                  Cash Won
                </div>
                <div className="">
                  <picture className="mr-1">
                    <img
                      height="auto"
                      width="21px"
                      src="/images/global-rupeeIcon.png"
                      alt=""
                      className="snip-img"
                    />
                  </picture>
                  <span
                    className={css.moneyBox_text}
                    style={{ fontSize: "1em", bottom: "-1px" }}
                  >
                    {profile && profile.wonAmount}
                  </span>
                </div>
                <span className={css.thin_divider_x}></span>
              </div>
            </div>
          </div>
          <div className="px-3 py-1 refereal_single_boxes_border">
            <div
              className={`d-flex align-items-center ${css.position_relative}`}
              style={{ height: "84px" }}
            >
              <picture>
                <img
                  height="32px"
                  width="32px"
                  src="/images/global-purple-battleIcon.png"
                  alt=""
                  className=""
                />
              </picture>
              <div className="pl-4">
                <div
                  className={`${css.text_uppercase} ${css.moneyBox_header}`}
                  style={{ fontSize: "1em" }}
                >
                  Battle Played
                </div>
                <div className="snip-div">
                  <span
                    className={css.moneyBox_text}
                    style={{ fontSize: "1em", bottom: "-1px" }}
                  >
                    {total && total}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-3 py-1refereal_single_boxes_border">
            <div
              className={`d-flex align-items-center ${css.position_relative}`}
              style={{ height: "84px" }}
            >
              <picture>
                <img
                  height="32px"
                  width="32px"
                  src="/images/referral-signup-bonus-new.png"
                  alt=""
                  className="snip-img"
                />
              </picture>
              <div className="pl-4">
                <div
                  className={`${css.text_uppercase} ${css.moneyBox_header}`}
                  style={{ fontSize: "1em" }}
                >
                  Referral Earning
                </div>
                <div className="">
                  <span
                    className={css.moneyBox_text}
                    style={{ fontSize: "1em", bottom: "-1px" }}
                  >
                    {profile && profile.referral_earning}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* <div className={css.divider_x}></div> */}
          <div className=" snipcss-A1eLC snip-div logout_btn">
            <Link
              to="/login"
              className={`${css.center_xy} `}
              onClick={(e) => logout(e)}
            >
              Log Out <IoIosLogOut className="icons" />
            </Link>
          </div>
        </div>
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
      {/* <ModalProfile style3={
                profileModalstyle
            } Enter={Enter}/> */}
      <div className={css.kyc_select} id="profileModal">
        <div className={css.overlay} />
        <div
          className={`${css.box}`}
          style={{
            bottom: "0px",
            position: "absolute",
          }}
        >
          <div className={css.bg_white}>
            <div className={`${css.header} ${css.cxy} ${css.flex_column}`}>
              <picture>
                <img
                  height="80px"
                  width="80px"
                  src="/images/avatars/Avatar2.png"
                  alt=""
                />
              </picture>
              <div className={`${css.header_text} mt-2`}>Choose Avatar</div>
            </div>
            <div className="mx-3 pb-3" style={{ paddingTop: "200px" }}>
              <div className="row justify-content-between col-10 mx-auto">
                <img
                  height="50px"
                  width="50px"
                  src="/images/avatars/Avatar1.png"
                  alt=""
                />
                <img
                  height="50px"
                  width="50px"
                  src="/images/avatars/Avatar2.png"
                  alt=""
                />
                <img
                  height="50px"
                  width="50px"
                  src="/images/avatars/Avatar3.png"
                  alt=""
                />
                <img
                  height="50px"
                  width="50px"
                  src="/images/avatars/Avatar4.png"
                  alt=""
                />
              </div>
              <div className="row justify-content-between col-10 mx-auto mt-3">
                <img
                  height="50px"
                  width="50px"
                  src="/images/avatars/Avatar5.png"
                  alt=""
                />
                <img
                  height="50px"
                  width="50px"
                  src="/images/avatars/Avatar6.png"
                  alt=""
                />
                <img
                  height="50px"
                  width="50px"
                  src="/images/avatars/Avatar7.png"
                  alt=""
                />
                <img
                  height="50px"
                  width="50px"
                  src="/images/avatars/Avatar8.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile1;
