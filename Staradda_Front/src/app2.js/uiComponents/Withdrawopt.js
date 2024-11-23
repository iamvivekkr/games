import React, { useState, useEffect } from "react";
import "../css/layout.css";
import "../css/homepage.css";
import css from "../css/with.css";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Loader.css";
// import findGif from "../css/loading.gif";
import findGif from "../css/loading_old.gif";
import io from "../Components/socket";
import Header from "../Components/Header";
const EndPoint = process.env.REACT_APP_API_URL;
const Withdrawopt = ({ walletUpdate }) => {
  const history = useHistory();

  const access_token = localStorage.getItem("token");
  const [Id, setId] = useState(null);
  const [user, setUser] = useState();
  const [holder_name, setHolder_name] = useState();
  const [bank_name, setBank_name] = useState();
  const [account_number, setAccount_number] = useState();
  const [paytmNumber, setpaytmNumber] = useState();

  const [confirm_account_number, setConfirm_account_number] = useState();
  const [ifsc_code, setIfsc_code] = useState();
  const [upi_id, setUpi_id] = useState();
  const [confirm_upi_id, setConfirm_upi_id] = useState();
  const [next, setNext] = useState(false);

  const [isCashFreePayoutActive, setCashFreePayoutActive] = useState(false);
  const [isRazorPayPayoutActive, setRazorPayPayoutActive] = useState(false);
  const [isDecentroPayoutActive, setDecentroPayoutActive] = useState(false);

  const [isRazorPayPayoutAuto, setRazorPayPayoutAuto] = useState(false);
  const [isDecentroPayoutAuto, setDecentroPayoutAuto] = useState(false);
  const [maxAutopayAmt, setMaxAutopayAmt] = useState(0);

  const [submitBtn, setSubmitBtn] = useState(true);
  const [withdrawal, setWithdrawal] = useState(true);
  const [Upiwithdrawal, setUpiWithdrawal] = useState(true);
  const [Bankwithdrawal, setBankWithdrawal] = useState(true);
  const [paytmwithdrawal, setpaytmWithdrawal] = useState(true);

  const [minLimit, setMinLimit] = useState(null);
  const [maxLimit, setMaxLimit] = useState(null);
  const [isLoading, setIsloading] = useState(false);

  const [type, setType] = useState(undefined);
  const [mount, setMount] = useState(false);

  // useEffect(() => {
  //   const addsetting = localStorage.getItem("sitSetting");
  //   const addCaseSetting = JSON.parse(addsetting);
  //   setWithdrawal(addCaseSetting.isWithdrawal);
  //   setUpiWithdrawal(addCaseSetting.isUpiWithdrawal);
  //   setBankWithdrawal(addCaseSetting.isBankWithdrawal);
  //   setMinLimit(addCaseSetting.withdrawalLimitMin);
  //   setMaxLimit(addCaseSetting.withdrawalLimitMax);
  // });

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(`${EndPoint}/me`, { headers })
      .then((res) => {
        setUser(res.data);
        // console.log(res.data);
        setId(res.data._id);
        setHolder_name(res.data.holder_name);
        setBank_name(res.data.bank_name);
        setAccount_number(res.data.account_number);
        setConfirm_account_number(res.data.confirm_account_number);
        setIfsc_code(res.data.ifsc_code);
        setUpi_id(res.data.upi_id);
        setConfirm_upi_id(res.data.confirm_upi_id);
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/login");
        }
      });

    axios
      .get(`${EndPoint}/website/setting`)
      .then((res) => {
        //console.log(res);
        setCashFreePayoutActive(res.data.isCashFreePayoutActive);
        setRazorPayPayoutActive(true);
        setDecentroPayoutActive(res.data.isDecentroPayoutActive);

        setRazorPayPayoutAuto(res.data.isRazorPayPayoutAuto);
        setDecentroPayoutAuto(res.data.isDecentroPayoutAuto);
        setMaxAutopayAmt(res.data.maxAutopayAmt);
        setpaytmWithdrawal(res.data?.ispaytmWithdrawal);

        // setUpiWithdrawal(addCaseSetting.isUpiWithdrawal)
        // setBankWithdrawal(addCaseSetting.isBankWithdrawal)
      })
      .catch((e) => {
        setCashFreePayoutActive(false);
        setRazorPayPayoutActive(false);
        setDecentroPayoutActive(false);
        setMaxAutopayAmt(0);
      });
  }, []);

  const handleIfscChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 11) {
      setIfsc_code(inputValue);
    }
  };
  const updateBankDetails = async () => {
    setIsloading(true);

    setMount(true);
    setSubmitBtn(false);
    // e.preventDefault();

    if (type === "upi") {
      let regex = /^[\w.-]+@[\w.-]+$/.test(upi_id);
      if (upi_id !== confirm_upi_id) {
        return Swal.fire({
          title: "UPI IDs do not match",
          text: "Please make sure your UPI IDs match",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          setSubmitBtn(true);
          setMount(false);
          setIsloading(false);
        });
      }
      if (regex) {
        const access_token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };

        setIsloading(true);
        const data = await axios
          .patch(
            `${EndPoint}/user/edit`,
            {
              holder_name,
              type,
              account_number,
              confirm_account_number,
              ifsc_code,
              upi_id,
              bankDetails: true,
            },
            { headers }
          )
          .then((res) => {
            setIsloading(false);
            // console.log('updata bank details', res)
            if (res.data.subCode === "200") {
              // console.log(res.data)
              let calculatedWallet =
                user.wonAmount -
                user.loseAmount +
                user.totalDeposit +
                user.referral_earning +
                user.hold_balance +
                user.totalBonus -
                (user.totalWithdrawl +
                  user.referral_wallet +
                  user.totalPenalty);

              withReqComes();
            } else {
              Swal.fire({
                title: res.data.msg,
                icon: "error",
                confirmButtonText: "OK",
              }).then(() => {
                setSubmitBtn(true);
                setMount(false);
              });
            }
          })
          .catch((e) => {
            console.log(e);
            setMount(false);
            if (e.response.status == 401) {
              localStorage.removeItem("token");
              localStorage.removeItem("token");
              window.location.reload();
              history.push("/login");
            }
          });
      } else {
        Swal.fire({
          title: `Invalid UPI ID: ${upi_id}`,
          text: "Please enter a valid UPI ID",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          setSubmitBtn(true);
        });
      }
    } else if (type === "banktransfer") {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      setIsloading(true);
      const data = await axios
        .patch(
          `${EndPoint}/user/edit`,
          {
            holder_name,
            type,
            account_number,
            confirm_account_number,
            ifsc_code,
            upi_id,
            bankDetails: true,
          },
          { headers }
        )
        .then((res) => {
          setIsloading(false);
          // console.log('updata bank details', res)
          if (res.data.subCode === "200") {
            // console.log(res.data)
            let calculatedWallet =
              user.wonAmount -
              user.loseAmount +
              user.totalDeposit +
              user.referral_earning +
              user.hold_balance +
              user.totalBonus -
              (user.totalWithdrawl + user.referral_wallet + user.totalPenalty);

            calculatedWallet == user.Wallet_balance
              ? doAutoPayout()
              : withReqComes();
          } else {
            Swal.fire({
              title: res.data.msg,
              icon: "error",
              confirmButtonText: "OK",
            }).then(() => {
              setSubmitBtn(true);
              setMount(false);
            });
          }
        })
        .catch((e) => {
          console.log(e);
          setMount(false);
          if (e.response.status == 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("token");
            window.location.reload();
            history.push("/login");
          }
        });
    } else if (type === "paytmransfer") {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      const data = await axios
        .patch(
          `${EndPoint}/user/edit`,
          {
            holder_name,
            paytmNumber,
          },
          { headers }
        )
        .then((res) => {
          setIsloading(false);
          // console.log('updata bank details', res)
          if (res.data.subCode === "200") {
            // console.log(res.data)
            let calculatedWallet =
              user.wonAmount -
              user.loseAmount +
              user.totalDeposit +
              user.referral_earning +
              user.hold_balance +
              user.totalBonus -
              (user.totalWithdrawl + user.referral_wallet + user.totalPenalty);

            calculatedWallet == user.Wallet_balance
              ? doAutoPayout()
              : withReqComes();
          } else {
            Swal.fire({
              title: res.data.msg,
              icon: "error",
              confirmButtonText: "OK",
            }).then(() => {
              setSubmitBtn(true);
              setMount(false);
            });
          }
        })
        .catch((e) => {
          console.log(e);
          setMount(false);
          if (e.response.status == 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("token");
            window.location.reload();
            history.push("/login");
          }
        });
    } else {
      setMount(false);
      setSubmitBtn(true);
    }
  };

  const [amount, setAmount] = useState();
  console.log({ submitBtn });
  //this function for handleAuto payout service with payment gateway

  const doAutoPayout = () => {
    if (isRazorPayPayoutAuto && type == "upi") {
      //alert('payoutFromRazorpay');
      if (amount <= maxAutopayAmt) {
        // payoutFromRazorpay()
      } else {
        withReqComes();
      }
    } else if (isDecentroPayoutAuto && type == "banktransfer") {
      //alert('payoutFromDecentro');
      withReqComes();
    } else {
      withReqComes();
    }
  };

  // const payoutFromCashfree = () => {
  //   if (amount && amount >= 95 && amount <= 50000 && type) {
  //     // e.preventDefault();
  //     const payment_gatway = "cashfree";
  //     const access_token = localStorage.getItem("token");
  //     const headers = {
  //       Authorization: `Bearer ${access_token}`,
  //     };

  //     axios
  //       .post(
  //         `${EndPoint}/withdraw/payoutcashfreebank`,
  //         {
  //           amount,
  //           type,
  //           payment_gatway,
  //         },
  //         { headers }
  //       )
  //       .then((res) => {
  //         walletUpdate();
  //         setMount(false);
  //         console.log(res.data);
  //         if (res.data.subCode === "200") {
  //           console.log("cash res", res);
  //           Swal.fire({
  //             title: res.data.message,
  //             icon: "success",
  //             confirmButtonText: "OK",
  //           });
  //         } else {
  //           Swal.fire({
  //             title: res.data.message,
  //             icon: "danger",
  //             confirmButtonText: "OK",
  //           });
  //         }
  //       })
  //       .catch((e) => {
  //         setMount(false);
  //         Swal.fire({
  //           title: "Error! try after sometime.",
  //           icon: "error",
  //           confirmButtonText: "OK",
  //         });
  //         console.log(e);
  //       });
  //   } else {
  //     setMount(false);
  //     let msg = "Enter all fields";
  //     if (!amount || !type) {
  //       let msg = "Enter all fields";
  //     } else if (95 <= amount <= 50000) {
  //       msg = "amount should be more than 95 and less then 50000.";
  //     }
  //     Swal.fire({
  //       title: msg,
  //       icon: "Error",
  //       confirmButtonText: "OK",
  //     });
  //   }
  // };
  // const payoutFromRazorpay = () => {
  //   if (amount && amount >= 95 && amount <= 50000 && type) {
  //     // e.preventDefault();
  //     const payment_gatway = 'razorpay'
  //     const access_token = localStorage.getItem('token')
  //     const headers = {
  //       Authorization: `Bearer ${access_token}`
  //     }

  //     axios
  //       .post(
  //         `${EndPoint}/withdraw/payoutrazorpaybank`,
  //         {
  //           amount,
  //           type,
  //           payment_gatway
  //         },
  //         { headers }
  //       )
  //       .then(res => {
  //         walletUpdate()
  //         setMount(false)
  //         console.log(res.data)
  //         if (res.data.subCode === '200') {
  //           console.log('cash res', res)
  //           Swal.fire({
  //             title: res.data.message,
  //             icon: 'success',
  //             confirmButtonText: 'OK'
  //           })
  //         } else {
  //           Swal.fire({
  //             title: res.data.message,
  //             icon: 'danger',
  //             confirmButtonText: 'OK'
  //           })
  //         }
  //       })
  //       .catch(e => {
  //         setMount(false)
  //         Swal.fire({
  //           title: 'Error! try after sometime.',
  //           icon: 'error',
  //           confirmButtonText: 'OK'
  //         })
  //         console.log(e)
  //       })
  //   } else {
  //     setMount(false)
  //     let msg = 'Enter all fields'
  //     if (!amount || !type) {
  //       let msg = 'Enter all fields'
  //     } else if (95 <= amount <= 50000) {
  //       msg = 'amount should be more than 95 and less then 50000.'
  //     }
  //     Swal.fire({
  //       title: msg,
  //       icon: 'Error',
  //       confirmButtonText: 'OK'
  //     })
  //   }
  // }

  //use for Razorpay payout end

  //use for decentro payout

  // const payoutFromDecentro = () => {
  //   if (amount && amount >= 95 && amount <= 50000 && type) {
  //     // e.preventDefault();
  //     const payment_gatway = 'decentro'
  //     const access_token = localStorage.getItem('token')
  //     const headers = {
  //       Authorization: `Bearer ${access_token}`
  //     }

  //     axios
  //       .post(
  //         `${EndPoint}/withdraw/payoutdecentrobank`,
  //         {
  //           amount,
  //           type,
  //           payment_gatway
  //         },
  //         { headers }
  //       )
  //       .then(res => {
  //         setTimeout(() => {
  //           walletUpdate()
  //         }, 5000)
  //         setMount(false)
  //         console.log(res.data)
  //         if (res.data.subCode === '200') {
  //           console.log('cash res', res)
  //           Swal.fire({
  //             title: res.data.message,
  //             icon: 'success',
  //             confirmButtonText: 'OK'
  //           })
  //         } else {
  //           Swal.fire({
  //             title: res.data.message,
  //             icon: 'danger',
  //             confirmButtonText: 'OK'
  //           })
  //         }
  //       })
  //       .catch(e => {
  //         setMount(false)
  //         Swal.fire({
  //           title: 'Error! try after sometime.',
  //           icon: 'error',
  //           confirmButtonText: 'OK'
  //         })
  //         console.log(e)
  //       })
  //   } else {
  //     setMount(false)
  //     let msg = 'Enter all fields'
  //     if (!amount || !type) {
  //       let msg = 'Enter all fields'
  //     } else if (95 <= amount <= 50000) {
  //       msg = 'amount should be more than 95 and less then 50000.'
  //     }
  //     Swal.fire({
  //       title: msg,
  //       icon: 'Error',
  //       confirmButtonText: 'OK'
  //     })
  //   }
  // }

  //use for decentro payout end

  const handleSubmitdata = () => {
    if (amount && amount >= 95 && amount <= 20000 && type) {
      // e.preventDefault();
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          `${EndPoint}/withdraw/bank`,
          {
            amount,
            type,
          },
          { headers }
        )
        .then((res) => {
          setTimeout(() => {
            walletUpdate();
          }, 5000);
          setMount(false);
          console.log(res.data);
          if (res.data.subCode === "200") {
            console.log("cash res", res);
            Swal.fire({
              title: res.data.message,
              icon: "success",
              confirmButtonText: "OK",
            });
          } else {
            Swal.fire({
              title: res.data.message,
              icon: "danger",
              confirmButtonText: "OK",
            });
          }
        })
        .catch((e) => {
          setMount(false);
          Swal.fire({
            title: "Error! try after sometime.",
            icon: "error",
            confirmButtonText: "OK",
          });
          console.log(e);
        });
    } else {
      setMount(false);
      let msg = "Enter all fields";
      if (!amount || !type) {
        let msg = "Enter all fields";
      } else if (95 <= amount <= 20000) {
        msg = "amount should be more than 95 and less then 100000.";
      }
      Swal.fire({
        title: msg,
        icon: "Error",
        confirmButtonText: "OK",
      });
    }
  };

  const withReqComes = async () => {
    try {
      setMount(true);

      if (type == "upi") {
        var payment_gatway = "upi";
      }

      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      if (!amount) {
        Swal.fire({
          title: "Invalid amount",
          text: "Please enter an amount within the allowed limits.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        setMount(true);
        await axios
          .post(
            `${EndPoint}/withdraw/request`,
            {
              amount,
              type,
              payment_gatway,
            },
            { headers }
          )
          .then((res) => {
            if (res.data.success) {
              setMount(false);

              Swal.fire({
                title: res?.data?.msg,
                icon: "success",
                confirmButtonText: "OK",
              });
              history.push("/");
            } else {
              Swal.fire({
                title: res.data.msg,
                icon: "error",
                confirmButtonText: "OK",
              }).then(() => {
                setMount(false);
                setSubmitBtn(true);
              });
            }

            setMount(false);
          })
          .catch((e) => {
            console.log(e);
            setMount(false);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="leftContainer mb_space"
        style={{ minHeight: "100vh", height: "100%" }}
      >
        <div className="container px-3 mt-5 py-5" style={{ height: "10px" }}>
          <div className="row">
            <div className="col mx-auto">
              <div className="mt-3">
                {user &&
                  user?.verified === "verified" &&
                  user?.Email !== null && (
                    <div className=" ">
                      <h4 className="pt-1 profile_headings ">
                        {type == undefined
                          ? "Choose withdrawal option"
                          : "Withdraw through"}
                      </h4>
                      {Boolean(!next) && (
                        <div>
                          {/* upi id */}
                          {Upiwithdrawal === true
                            ? Boolean(isRazorPayPayoutActive) && (
                                <div
                                  onClick={() => {
                                    setType("upi");
                                    setNext(true);
                                  }}
                                  className="add-fund-box my-3"
                                  style={
                                    {
                                      // paddingTop: '0px',
                                      // height: '60px'
                                      //pointerEvents: "none", opacity: "0.6"
                                    }
                                  }
                                >
                                  <div
                                    className="d-flex align-items-center profile_info_small_box_main bank_page_cards mt-4"
                                    style={{ minHeight: "auto" }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <img
                                        width="45px"
                                        src={
                                          process.env.PUBLIC_URL + "/UPI.png"
                                        }
                                        alt=""
                                        style={{
                                          marginLeft: "7px",
                                          paddingBottom: "10px",
                                          paddingLeft: "3px",
                                          paddingTop: "5px",
                                        }}
                                      />
                                    </div>
                                    <div className="d-flex justify-content-center flex-column ml-4">
                                      <div className="text-left">
                                        <h3 style={{ fontWeight: "500" }}>
                                          Withdraw through UPI
                                        </h3>
                                        <ul>
                                          <li>
                                            Minimum withdrawal amount {minLimit}
                                          </li>
                                          <li>
                                            Instant withdrawal within 30sec.
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="jss31"></div>
                                    </div>
                                  </div>
                                </div>
                              )
                            : ""}
                          {/* bank account number */}
                          {/* {Bankwithdrawal === true
                            ? Boolean(isRazorPayPayoutActive) && (
                                <div
                                  onClick={() => {
                                    setType("banktransfer");
                                    setNext(true);
                                  }}
                                  className="add-fund-box my-3"
                                  // style={{ paddingTop: '0px', height: '60px' }}
                                >
                                  <div
                                    className="d-flex align-items-center profile_info_small_box_main bank_page_cards"
                                    style={{ minHeight: "auto" }}
                                  >
                                    <div
                                      className="d-flex align-items-center"
                                      // style={{
                                      //   height: '60px',
                                      //   display: 'flex',
                                      //   textAlign: 'center'
                                      // }}
                                    >
                                      <img
                                        width="45px"
                                        src="../images/Bank.png"
                                        alt=""
                                        style={{
                                          marginLeft: "7px",
                                          paddingBottom: "10px",
                                          paddingLeft: "3px",
                                          paddingTop: "5px",
                                        }}
                                      />
                                    </div>
                                    <div className="d-flex justify-content-center flex-column ml-4">
                                      <div className="text-left">
                                        <h3 style={{ fontWeight: "500" }}>
                                          Bank Transfer
                                        </h3>
                                        <ul>
                                          <li>
                                            Minimum withdrawal amount {minLimit}
                                          </li>
                                          <li>
                                            Instant withdrawal within 30sec.
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="jss31"></div>
                                    </div>
                                  </div>
                                </div>
                              )
                            : ""} */}
                          {/* paytm number */}

                          {paytmwithdrawal === true
                            ? Boolean(isRazorPayPayoutActive) && (
                                <div
                                  onClick={() => {
                                    setType("paytmransfer");
                                    setNext(true);
                                  }}
                                  className="add-fund-box my-3"
                                  // style={{ paddingTop: '0px', height: '60px' }}
                                >
                                  <div
                                    className="d-flex align-items-center profile_info_small_box_main bank_page_cards"
                                    style={{ minHeight: "auto" }}
                                  >
                                    <div
                                      className="d-flex align-items-center"
                                      // style={{
                                      //   height: '60px',
                                      //   display: 'flex',
                                      //   textAlign: 'center'
                                      // }}
                                    >
                                      <img
                                        width="45px"
                                        src="../images/icons/paytm.png"
                                        alt=""
                                        style={{
                                          marginLeft: "7px",
                                          paddingBottom: "10px",
                                          paddingLeft: "3px",
                                          paddingTop: "5px",
                                        }}
                                      />
                                    </div>
                                    <div className="d-flex justify-content-center flex-column ml-4">
                                      <div className="text-left">
                                        <h3 style={{ fontWeight: "500" }}>
                                          Paytm Transfer
                                        </h3>
                                        <ul>
                                          <li>
                                            Minimum withdrawal amount {minLimit}
                                          </li>
                                          <li>
                                            Instant withdrawal within 30sec.
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="jss31"></div>
                                    </div>
                                  </div>
                                </div>
                              )
                            : ""}
                        </div>
                      )}

                      {Boolean(next) && (
                        <div>
                          <div className="row bg-light p-1">
                            <div
                              className="text-left w-100"
                              style={{ background: "white" }}
                            >
                              {/* upi id */}
                              {Boolean(
                                isRazorPayPayoutActive || isCashFreePayoutActive
                              ) &&
                                Boolean(type == "upi") && (
                                  <div className="add-fund-box my-3">
                                    <div
                                      className="d-flex align-items-center profile_info_small_box_main bank_page_cards"
                                      style={{ minHeight: "auto" }}
                                    >
                                      <div className="d-flex align-items-center ">
                                        <img
                                          width="45px"
                                          src={
                                            process.env.PUBLIC_URL + "/UPI.png"
                                          }
                                          alt=""
                                          style={{
                                            marginLeft: "7px",
                                            paddingBottom: "10px",
                                            paddingLeft: "3px",
                                            paddingTop: "5px",
                                          }}
                                        />
                                      </div>
                                      <div className="d-flex justify-content-center flex-column ml-4">
                                        <div className="text-left">
                                          <h3 style={{ fontWeight: "500" }}>
                                            Withdraw through UPI
                                          </h3>

                                          <ul>
                                            <li>
                                              Minimum withdrawal amount{" "}
                                              {minLimit}
                                            </li>
                                            <li>
                                              Instant withdrawal within 30sec.
                                            </li>
                                          </ul>
                                        </div>
                                        <div className="jss31"></div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setNext(false);
                                        }}
                                        className="btn btn-info text-white font-weight-bold ml-auto mr-3 "
                                        style={{ fontSize: "0.5rem" }}
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  </div>
                                )}
                              {/* bank account number */}
                              {Boolean(isRazorPayPayoutActive) &&
                                Boolean(type == "banktransfer") && (
                                  <div className="add-fund-box my-3 ">
                                    <div
                                      className="d-flex align-items-center profile_info_small_box_main bank_page_cards"
                                      style={{ minHeight: "auto" }}
                                    >
                                      <div className="d-flex align-items-center">
                                        <img
                                          width="45px"
                                          src="../images/Bank.png"
                                          alt=""
                                          style={{
                                            marginLeft: "7px",
                                            paddingBottom: "10px",
                                            paddingLeft: "3px",
                                            paddingTop: "5px",
                                          }}
                                        />
                                      </div>
                                      <div className="d-flex justify-content-center flex-column ml-4">
                                        <div className="text-left">
                                          <h3 style={{ fontWeight: "500" }}>
                                            Bank Transfer
                                          </h3>

                                          <ul>
                                            <li>
                                              Minimum withdrawal amount{" "}
                                              {minLimit}
                                            </li>
                                            <li>
                                              Instant withdrawal within 30sec.
                                            </li>
                                          </ul>
                                        </div>
                                        <div className="jss31"></div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setType(undefined);
                                          setNext(false);
                                          console.log(type);
                                        }}
                                        className="btn btn-info text-white font-weight-bold ml-auto mr-3"
                                        style={{ fontSize: "0.5rem" }}
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  </div>
                                )}

                              {/* paytm number */}
                              {Boolean(isRazorPayPayoutActive) &&
                                Boolean(type == "paytmransfer") && (
                                  <div className="add-fund-box my-3 p-2">
                                    <div
                                      className="d-flex align-items-center profile_info_small_box_main bank_page_cards"
                                      style={{ minHeight: "auto" }}
                                    >
                                      <div className="d-flex align-items-center">
                                        <img
                                          width="45px"
                                          src="../images/icons/paytm.png"
                                          alt=""
                                          style={{
                                            marginLeft: "7px",
                                            paddingBottom: "10px",
                                            paddingLeft: "3px",
                                            paddingTop: "5px",
                                          }}
                                        />
                                      </div>
                                      <div className="d-flex justify-content-center flex-column ml-4 ">
                                        <div className="text-left">
                                          <h3 style={{ fontWeight: "500" }}>
                                            Paytm Transfer
                                          </h3>

                                          <ul>
                                            <li>
                                              Minimum withdrawal amount{" "}
                                              {minLimit}
                                            </li>
                                            <li>
                                              Instant withdrawal within 30sec.
                                            </li>
                                          </ul>
                                        </div>
                                        <div className="jss31"></div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setType(undefined);
                                          setNext(false);
                                          console.log(type);
                                        }}
                                        className="btn btn-info text-white font-weight-bold ml-auto mr-3"
                                        style={{ fontSize: "0.5rem" }}
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  </div>
                                )}

                              <div className="mt-5 p-3">
                                {/* bank account number */}
                                {Boolean(isRazorPayPayoutActive) &&
                                  type == "banktransfer" && (
                                    <div className="">
                                      <div>
                                        <label
                                          htmlFor="username "
                                          className="mr-5 commaon_label"
                                        >
                                          <i className="far fa-user mr-2"></i>
                                          Account holder name (खाता धारक का नाम)
                                        </label>
                                        <div className="col-12 mb-3 p-0">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="account_no"
                                            placeholder="Enter Account Name"
                                            name="ifsc"
                                            value={holder_name}
                                            onChange={(e) =>
                                              setHolder_name(e.target.value)
                                            }
                                            required
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label
                                          htmlFor="username "
                                          className="mr-5 commaon_label"
                                          // style={{ color: "#d28d01" }}
                                        >
                                          <i className="far fa-bank mr-2"></i>
                                          Account number (खाता संख्या):
                                        </label>
                                        <div className="col-12 mb-3 p-0">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="account_no"
                                            placeholder="Enter your bank account number"
                                            name="upi"
                                            value={account_number}
                                            onChange={(e) =>
                                              setAccount_number(e.target.value)
                                            }
                                          />
                                        </div>
                                        <label
                                          htmlFor="username "
                                          className="mr-5 commaon_label"
                                          // style={{ color: "#d28d01" }}
                                        >
                                          <i className="far fa-bank mr-2"></i>{" "}
                                          Confirm Account number (कन्फर्म खाता
                                          संख्या) :
                                        </label>
                                        <div className="col-12 mb-3 p-0">
                                          <input
                                            type="text"
                                            className="form-control commaon_input_box"
                                            id="account_no"
                                            placeholder="Re Enter Your Bank Account Number"
                                            name="ifsc"
                                            value={confirm_account_number}
                                            onChange={(e) =>
                                              setConfirm_account_number(
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label
                                          htmlFor="username "
                                          className="mr-5 commaon_label"
                                          // style={{ color: "#d28d01" }}
                                        >
                                          <i className="far fa-bank mr-2"></i>
                                          IFSC code (IFSC कोड ) :
                                        </label>
                                        <div className="col-12 mb-3 p-0">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="account_no"
                                            placeholder="Enter IFSC code"
                                            name="ifsc"
                                            value={ifsc_code}
                                            onChange={handleIfscChange}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                {/* upi id */}
                                {Boolean(isRazorPayPayoutActive) &&
                                  type == "upi" && (
                                    <div className="mt-5">
                                      <div>
                                        <label
                                          htmlFor="username "
                                          className="mr-5 commaon_label"
                                          // style={{ color: "#d28d01" }}
                                        >
                                          <i className="far fa-user mr-2"></i>
                                          Account holder name (खाता धारक का नाम)
                                          :
                                        </label>
                                        <div className="col-12 mb-3 p-0">
                                          <input
                                            type="text"
                                            className="form-control commaon_input_box"
                                            id="account_no"
                                            placeholder="Enter Account Name"
                                            name="ifsc"
                                            value={holder_name}
                                            onChange={(e) =>
                                              setHolder_name(e.target.value)
                                            }
                                            required
                                          />
                                        </div>
                                      </div>

                                      <label
                                        htmlFor="username "
                                        className="mr-5 commaon_label"
                                        // style={{ color: "#d28d01" }}
                                      >
                                        <i className="far fa-bank mr-2"></i>UPI
                                        ID (UPI आईडी) || EX. (9999999999@xyz)
                                      </label>
                                      <div className="col-12 mb-3 p-0">
                                        <input
                                          type="text"
                                          className="form-control commaon_input_box"
                                          id="account_no"
                                          placeholder="Enter Your UPI ID Ex.(9999999999@xyz)"
                                          name="ifsc"
                                          value={upi_id}
                                          onChange={(e) =>
                                            setUpi_id(e.target.value)
                                          }
                                        />
                                      </div>

                                      <label
                                        htmlFor="username "
                                        className="mr-5 commaon_label"
                                        // style={{ color: "#d28d01" }}
                                      >
                                        <i className="far fa-bank mr-2"></i>{" "}
                                        Confirm UPI ID: (कन्फर्म UPI आईडी) ||
                                        EX. (9999999999@xyz)
                                      </label>
                                      <div className="col-12 mb-3 p-0">
                                        <input
                                          type="text"
                                          className="form-control commaon_input_box"
                                          id="account_no"
                                          placeholder="Re Enter Your UPI ID Ex.(9999999999@xyz)"
                                          name="ifsc"
                                          value={confirm_upi_id}
                                          onChange={(e) =>
                                            setConfirm_upi_id(e.target.value)
                                          }
                                        />
                                      </div>
                                      <small className="text-dark small_para">
                                        कृपया सही UPI आईडी Ex.(9999999999@xyz)
                                        दर्ज करें।*
                                      </small>
                                    </div>
                                  )}

                                {/* paytm number */}
                                {Boolean(isRazorPayPayoutActive) &&
                                  type == "paytmransfer" && (
                                    <div>
                                      <div>
                                        <label
                                          htmlFor="username "
                                          className="mr-5 commaon_label"
                                          // style={{ color: "#d28d01" }}
                                        >
                                          <i className="far fa-user mr-2"></i>
                                          Account holder name (खाता धारक का नाम)
                                        </label>
                                        <div className="col-12 mb-3 p-0">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="account_no"
                                            placeholder="Enter Account Name"
                                            name="ifsc"
                                            value={holder_name}
                                            onChange={(e) =>
                                              setHolder_name(e.target.value)
                                            }
                                            required
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label
                                          htmlFor="username "
                                          className="mr-5 commaon_label"
                                          // style={{ color: "#d28d01" }}
                                        >
                                          <i className="far fa-bank mr-2"></i>
                                          Paytm number (Paytm नंबर):
                                        </label>
                                        <div className="col-12 mb-3 p-0">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id="account_no"
                                            placeholder="Enter your Paytm number"
                                            name="upi"
                                            value={paytmNumber}
                                            onChange={(e) =>
                                              setpaytmNumber(e.target.value)
                                            }
                                          />
                                        </div>
                                        <label
                                          htmlFor="username "
                                          className="mr-5 commaon_label"
                                          // style={{ color: "#d28d01" }}
                                        >
                                          <i className="far fa-bank mr-2"></i>{" "}
                                          Confirm Paytm number (कन्फर्म Paytm
                                          नंबर) :
                                        </label>
                                        <div className="col-12 mb-3 p-0">
                                          <input
                                            type="text"
                                            className="form-control commaon_input_box"
                                            id="account_no"
                                            placeholder="Re Enter Your Paytm Number"
                                            name="ifsc"
                                            value={confirm_account_number}
                                            onChange={(e) =>
                                              setConfirm_account_number(
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>

                            {/* bank details end */}

                            <div className="px-3">
                              <label
                                htmlFor="username "
                                className="mr-5 commaon_label"
                                // style={{ color: "#d28d01" }}
                              >
                                <img
                                  src={
                                    "/images/LandingPage_img/global-rupeeIcon.png"
                                  }
                                  alt=""
                                  className="img-fluid"
                                  style={{ maxWidth: "20px" }}
                                />{" "}
                                Coin
                              </label>
                            </div>
                            <div className="field col-12 p-0 mt-1 mb-3 px-3">
                              <input
                                type="phone"
                                className="form-control  search-slt commaon_input_box"
                                name="amount"
                                placeholder="Enter coin"
                                // onChange={(e) => setAmount(e.target.value)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  e.target.value = value.replace(/[^\d]/g, "");
                                  setAmount(e.target.value);
                                }}
                              />
                            </div>
                            <div
                              className="col-12 p-0 mt-2 pt-3 mr-2"
                              style={{
                                marginBottom: "100px",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {isLoading ? (
                                <div className="pl-2 text-center">
                                  <img
                                    src={findGif}
                                    style={{ width: "80px", height: "80px" }}
                                  />
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className=" btn-block btn-sm "
                                  id="withdrawcase"
                                  style={{
                                    height: "40px",
                                    backgroundColor: "rgb(210 141 1)",
                                    color: "white",
                                    borderRadius: "16px",
                                    border: "none",
                                    width: "65%",
                                  }}
                                  disabled={Boolean(submitBtn) ? false : true}
                                  onClick={() => updateBankDetails()}
                                >
                                  WITHDRWAL SUBMIT
                                </button>
                              )}

                              {/* {Boolean(submitBtn) ? "" : "Reload Page"}s */}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {user && user?.verified === "unverified" && (
                  <Link to="/profile">
                    <div style={{ height: "100px" }} className="kyc_page_cards">
                      <picture className="ml-3">
                        <img
                          src="/images/alert.svg"
                          alt=""
                          width="32px"
                          className=""
                        />
                      </picture>
                      <p className="ml-1  mytext ">
                        Complete KYC to take Withdrawals Click here !
                      </p>
                    </div>
                  </Link>
                )}
                {user && user.verified === "reject" && (
                  <div style={{ height: "100px" }} className="kyc_page_cards">
                    <picture className="ml-3">
                      <img
                        src="/images/alert.svg"
                        alt=""
                        width="32px"
                        className=""
                      />
                    </picture>
                    <p className="ml-1  mytext ">
                      Your kyc was rejected please please try again !
                    </p>
                  </div>
                )}
                {user && user.verified === "pending" && (
                  <div style={{ height: "100px" }} className="kyc_page_cards">
                    <picture className="ml-3">
                      <img
                        src="/images/alert.svg"
                        alt=""
                        width="32px"
                        className=""
                      />
                    </picture>
                    <p className="ml-1  mytext  ">
                      Please wait your kyc under process
                    </p>
                  </div>
                )}
                {user && user?.Email === null && (
                  <div style={{ height: "100px" }} className="kyc_page_cards">
                    <picture className="ml-3">
                      <img
                        src="/images/alert.svg"
                        alt=""
                        width="32px"
                        className=""
                      />
                    </picture>
                    <p className="ml-1  mytext ">
                      Complete Email Verification to take Withdrawals
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Withdrawopt;
