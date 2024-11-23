import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import css from "../css/Addcase.module.css";
import Compressor from "compressorjs";
import css1 from "../css/Pan.module.css";
import Rightcontainer from "../Components/Rightcontainer";
import "../css/Loader.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/viewGame1.css";
import "../css/layout.css";
import Swal from "sweetalert2";
import Header from "../Components/Header";
import socket from "../Components/socket";
import "../css/landing.css";
import Modal from "react-bootstrap/Modal";
import { BsArrowRight, BsQrCodeScan } from "react-icons/bs";
import DownloadLink from "react-download-link";
import Spinner from "react-bootstrap/Spinner";
const EndPoint = process.env.REACT_APP_API_URL;

const Addcase = ({ walletUpdate }) => {
  const history = useHistory();
  let method = useRef();
  let checkInterval;
  const [userAllData, setUserAllData] = useState();

  const access_token = localStorage.getItem("token");

  const [isLoading1, setIsloading1] = useState(false);
  const [global, setGlobal] = useState(100);
  const [next, setNext] = useState(1);
  const [process, setProcess] = useState(false);
  const [isMobile, setMobile] = useState(false);

  const [isCashFreeActive, setCashFreeActive] = useState(true);
  const [isPhonePayActive, setIsPhonePayActive] = useState(false);
  const [isMyPayActive, setIsMyPayActive] = useState(false);
  const [isPineLabActive, setPineLabActive] = useState(false);
  const [isRazorPayActive, setRazorPayActive] = useState(false);
  const [isDecentroActive, setDecentroActive] = useState(false);
  const [isHoadaPaypayInActive, setHoadaPaypayInActive] = useState(false);
  const [ManualPaymentdata, setManualPaymentdata] = useState([]);

  const [manualData, setManualData] = useState([]);
  const [PayOneImage, setPayOneImage] = useState("");
  const [PayTwoImage, setPayTwoImage] = useState("");
  const [PayThreeImage, setPayThreeImage] = useState("");
  const [PayFourImage, setPayFourImage] = useState("");
  const [PayFiveImage, setPayFiveImage] = useState("");

  const [show_won, setShow_won] = useState(false);
  const handleClose_won = () => setShow_won(false);
  const [scrnshot, setScrnshot] = useState(null);
  const [fecthStatus, setFecthStatus] = useState();
  const [scrnshot1, setScrnshot1] = useState("");
  const handleShow_won = () => setShow_won(true);

  const [qrCode, setQrCode] = useState();
  const [walletOption, setWalletOption] = useState("airtel");
  const [bankCode, setBankCode] = useState(3003);

  const [account_mail_id, setAccount_mail_id] = useState();
  const [account_name, setAccount_name] = useState();
  const [accountPhone, setAccountPhone] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [minLimit, setMinLimit] = useState(null);
  const [maxLimit, setMaxLimit] = useState(null);
  const [amount, setamount] = useState("");
  const [utr, setutr] = useState("");

  // console.log(maxLimit)

  const addsetting = localStorage.getItem("sitSetting");
  const addCaseSetting = JSON.parse(addsetting);

  // Hoada Hooks

  const [hoadaPay, setHoadaPay] = useState(false);

  useEffect(() => {
    setMinLimit(addCaseSetting?.depositlimitMin);
    setMaxLimit(addCaseSetting?.depositlimitMax);
  }, []);

  const handleNext = () => {
    if (global < minLimit || global > maxLimit) {
      Swal.fire({
        title: `Minimum amount should be greater than ${minLimit} and maximum amount should be less than ${maxLimit}`,

        confirmButtonText: "OK",
        content: "custom-swal-content",
      });
    } else {
      setNext(2);
    }
  };

  //Function to load razorpay script for the display of razorpay payment SDK.
  function loadRazorpayScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  //function will get called when clicked on the pay button.
  async function displayRazorpayPaymentSdk(
    channel,
    method,
    upiMethod,
    razorpay
  ) {
    const res = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. please check are you online?");
      return;
    }
    //setProcess(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    // creating a new order and sending order ID to backend
    const response = await axios.post(
      `${EndPoint}/user/razorpay_order`,
      {
        amount: global,

        channel: channel,
        payment_method: method,
        provider: walletOption,
        bankCode: bankCode,
        account_name: account_name,
        payment_gatway: razorpay,
      },
      { headers }
    );
    if (!response) {
      alert("Server error. please check are you onlin?");
      return;
    }

    // Getting the order details back
    let order_id = response.data.txnID;
    let order_token = response.data.orderdata.id;
    const data = response.data.orderdata;
    const options = {
      key: "rzp_live_hmxBSXgEqtBqJq",
      name: "Rk Ludo",
      description: "Skill Based Game Tournament",
      order_id: data.id,
      prefill: {
        name: account_name,
        email: account_mail_id,
        contact: accountPhone,
      },
      handler: async (response) => {
        //console.log(response)
        try {
          const paymentId = response.razorpay_payment_id;

          checkrazorpaydeposit(order_id, order_token, "SUCCESS", paymentId);
        } catch (err) {
          checkrazorpaydeposit(order_id, order_token, "FAILED");
          console.log(err);
        }
      },
      theme: {
        color: "#686CFD",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const checkrazorpaydeposit = (
    order_id,
    order_token,
    order_status,
    paymentId
  ) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        `${EndPoint}/razorpaydesposit/response`,
        { order_id, order_token, order_status, paymentId },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        history.push("/");
        setTimeout(() => {
          Swal.fire({
            title: title,
            icon: icon,
            confirmButtonText: "OK",
          });
        }, 1000);
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };

  //use for upigatway
  const depositUpiGateway = (channel, method, upiMethod, upigateway) => {
    // if (account_name && account_mail_id) {
    setProcess(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        `${EndPoint}/user/depositeupi`,
        {
          amount: global,
          channel: channel,
          payment_method: method,
          provider: walletOption,
          bankCode: bankCode,
          account_name: account_name,
          account_mail_id: account_mail_id,
          payment_gatway: upigateway,
        },
        { headers }
      )
      .then((res) => {
        if (res.data.data.status) {
          console.log(res.data.data.data.payment_url);
          console.log(res.data.data.data.order_id);
          let order_id = res.data.txnID;
          let order_token = res.data.data.data.order_id;
          setProcess(false);
          window.open(res.data.data.data.payment_url);
          setTimeout(() => {
            checkupideposit(order_id, order_token);
            setProcess(false);
          }, 60000);
        } else {
          setProcess(false);
          Swal.fire({
            title: res.data.data.msg,
            icon: "danger",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((e) => {
        alert(e);
      });
    // } else {
    //   Swal.fire({
    //     title: 'Account holder name or Mail id is required',
    //     icon: 'danger',
    //     confirmButtonText: 'OK'
    //   })
    // }
  };
  const depositUpiGateway2 = (channel, method, upiMethod, upigateway) => {
    // if (account_name && account_mail_id) {
    setProcess(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        `${EndPoint}/user/depositeupi-2`,
        {
          amount: global,
          channel: channel,
          payment_method: method,
          provider: walletOption,
          bankCode: bankCode,
          account_name: account_name,
          account_mail_id: account_mail_id,
          payment_gatway: upigateway,
        },
        { headers }
      )
      .then((res) => {
        if (res.data.data.status) {
          console.log(res.data.data.data.payment_url);
          console.log(res.data.data.data.order_id);
          let order_id = res.data.txnID;
          let order_token = res.data.data.data.order_id;
          setProcess(false);
          window.open(res.data.data.data.payment_url);
          setTimeout(() => {
            checkupideposit(order_id, order_token);
            setProcess(false);
          }, 60000);
        } else {
          setProcess(false);
          Swal.fire({
            title: res.data.data.msg,
            icon: "danger",
            confirmButtonText: "OK",
          });
        }
      })
      .catch((e) => {
        alert(e);
      });
    // } else {
    //   Swal.fire({
    //     title: 'Account holder name or Mail id is required',
    //     icon: 'danger',
    //     confirmButtonText: 'OK'
    //   })
    // }
  };

  // PHONEPAY GETWAY API

  const fetchPaymentUrl = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${EndPoint}/phonpay-request?amount=${global}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const data = await response.json();
      if (data) {
        setIsLoading(false);
        console.log(data.data, "data");
        window.location.href = data.data.instrumentResponse.redirectInfo.url;
      }
    } catch (error) {
      console.error("Error fetching payment URL:", error);
      setIsLoading(false);
    }
  };

  // HOADA PAY GETWAY API
  const Hoada = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${EndPoint}/haodapay-request-payin?amount=${global}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const data = await response.json();
      if (data) {
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);

        const isMobile = window.innerWidth < 768;

        if (isMobile) {
          //  window.location.href = data.data.data.intent_link;
          window.location.href = data.data.data.payment_link;
        } else {
          window.location.href = data.data.data.payment_link;
        }
      }
    } catch (error) {
      console.error("Error fetching payment URL:", error);
      setIsLoading(false);
    }
  };

  // MYPAY GETWAY API
  const myPay = async () => {
    try {
      setProcess(true);

      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      const paymentData = {
        amount: global,
      };

      const response = await axios.post(
        `${EndPoint}/mypay/payin`,
        paymentData,
        { headers }
      );

      console.log(response, "res");

      if (response.data && response.data.status === false) {
        Swal.fire({
          title: response.data.msg,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (response.data) {
        let order_id = response.data.txnID;
        let order_token = response.data.clientrefid;

        window.open(`${response.data?.data?.qrstring}&am=${global}`);

        setTimeout(() => {
          checkupideposit(order_id, order_token);
          setProcess(false);
        }, 30000);
      } else {
        setProcess(false);
        Swal.fire({
          title: "An unexpected error occurred",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      setProcess(false);
      console.error(error);

      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 429)
      ) {
        Swal.fire({
          title: error.response.data.msg || "Bad request or too many requests",
          icon: "warning",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error! Please refresh and contact admin",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      alert(error);
    }
  };

  const checkupideposit = (order_id, order_token) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        `${EndPoint}/depositupipay/response`,
        { order_id, order_token },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        history.push("/");
        setTimeout(() => {
          Swal.fire({
            title: title,
            icon: icon,
            confirmButtonText: "OK",
          });
        }, 1000);
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };

  //use for cashfree gatway
  const deposit = (channel, method, upiMethod) => {
    setProcess(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        `${EndPoint}/user/deposite`,
        {
          amount: global,
          channel: channel,
          payment_method: method,
          provider: walletOption,
          bankCode: bankCode,
        },
        { headers }
      )
      .then((res) => {
        if (res.data.data.payment_method == "app") {
          window.location.href = res.data.data.data.url;
          checkInterval = setInterval(
            (ID) => {
              checkout(ID);
            },
            10000,
            res.data.txnID
          );
        } else if (
          res.data.data.channel == "link" &&
          res.data.data.payment_method == "upi"
        ) {
          checkInterval = setInterval(
            (ID) => {
              checkout(ID);
            },
            10000,
            res.data.txnID
          );
          window.location.href = res.data.data.data.payload[upiMethod];
        } else if (
          res.data.data.channel == "qrcode" &&
          res.data.data.payment_method == "upi"
        ) {
          setQrCode(res.data.data.data.payload.qrcode);
          setProcess(false);
          setNext(3);
          checkInterval = setInterval(
            (ID) => {
              checkout(ID);
            },
            10000,
            res.data.txnID
          );
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const checkout = (paymentID) => {
    socket.emit("getprofile");

    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        `${EndPoint}/checkout/deposite/txn`,
        { txnID: paymentID },
        { headers }
      )
      .then((res) => {
        // alert(res.data.txnStatus)
        if (res.data.txnStatus == "PAID") {
          walletUpdate();
          clearInterval(checkInterval);
          Swal.fire({
            title: res.data.msg,
            icon: "success",
            confirmButtonText: "OK",
          });

          setProcess(false);
          setNext(1);
          history.push("/");
        } else if (res.data.txnStatus == "FAILED") {
          walletUpdate();
          clearInterval(checkInterval);
          Swal.fire({
            title: res.data.msg,
            icon: "error",
            confirmButtonText: "OK",
          });

          setProcess(false);
          setNext(1);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    let access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(`${EndPoint}/me`, { headers })
      .then((res) => {
        setUserAllData(res.data);
        setAccount_mail_id(res.data.Email);
        setAccount_name(res.data.holder_name);
        setAccountPhone(res.data.Phone);
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
        console.log(res.data);
        setCashFreeActive(res.data.isCashFreeActive);
        setRazorPayActive(res.data.isRazorPayActive);
        setDecentroActive(res.data.isDecentroActive);
        setPineLabActive(res.data.isPineLabActive);

        setIsMyPayActive(res.data.isMyPayActive);
        setHoadaPaypayInActive(res.data.isHaodaPayPayInActive);
      })
      .catch((e) => {
        setCashFreeActive(false);
        setRazorPayActive(false);
        setDecentroActive(false);
        setPineLabActive(false);

        setIsMyPayActive(false);
      });

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      setMobile(true);
    }
  }, []);

  // QR CODE IMAGES DOWNLOAD ---------------------------------------------------

  const handleImageDownload = (item) => {
    const link = document.createElement("a");
    link.href = item;
    link.download = "QR-Code.png"; // You can specify the downloaded file name here
    link.click();
  };
  // clear Image
  const clearImage = (e) => {
    setScrnshot1(null);
    setScrnshot(null);
  };
  // MANUAL PAYMENTS METHODS API

  const handleChange = (e) => {
    setScrnshot1(URL.createObjectURL(e.target.files[0]));
    const image = e.target.files[0];
    if (image && image.size / 1000 > 300) {
      console.log(" compression");
      new Compressor(image, {
        quality: 0.6,
        success(compressedResult) {
          if (compressedResult) {
            setScrnshot(compressedResult);
          } else {
            setScrnshot(image);
          }
        },
      });
    } else {
      setScrnshot(e.target.files[0]);
    }
  };

  const ManualPayment = () => {
    const access_token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${access_token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${EndPoint}/gatewaysettings/data`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result?.isPhonePayActive);
        setManualData(result);
        setPayOneImage(result?.isPayOneImage);
        setPayTwoImage(result?.isPayTwoImage);
        setPayThreeImage(result?.isPayThreeImage);
        setPayFourImage(result?.isPayFourImage);
        setPayFiveImage(result?.isPayFiveImage);
        setIsPhonePayActive(result?.isPhonePayActive);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    ManualPayment();
  }, []);

  // getImage URl
  const [ImageUrl, setImageUrl] = useState("");

  const getImageUrl = (item) => {
    setImageUrl(item);
  };

  const ManualPayments = () => {
    setIsloading1(true);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${access_token}`);

    var formdata = new FormData();
    formdata.append("Transaction_Screenshot", scrnshot);
    formdata.append("amount", global);
    formdata.append("referenceId", utr);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${EndPoint}/manual/deposit/txn`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setIsloading1(false);

        if (result.status === "Pending") {
          Swal.fire({
            title: result.message,
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: result.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        history.push("/");
        handleClose_won();
      })

      .catch((error) => console.log("error", error));
  };

  return (
    <>
      <Header user={userAllData} />
      <div className="leftContainer mb_space p-2">
        <div className="pt-5 mt-5  Orher_page_main_section">
          {Boolean(!process) && (
            <div>
              {Boolean(next == 1) && (
                <div className="">
                  <h2 className="profile_headings">Choose amount to add</h2>
                  <div className="add_amount_main_box mt-4">
                    <div className="add_amount_main_box_inner">
                      <label className="label">Enter Amount</label>
                      <div className="enter_amount_input_box">
                        <span>
                          <img
                            className="mx-0"
                            src="/images/LandingPage_img/global-rupeeIcon.png"
                            alt=""
                            width="20x"
                            height="20x"
                          />
                        </span>
                        <input
                          className="enter_amount_input"
                          type="tel"
                          id="amountInput"
                          value={global}
                          onChange={(e) => {
                            e.target.value > 0
                              ? e.target.value <= 50000
                                ? setGlobal(parseInt(e.target.value))
                                : setGlobal(50000)
                              : e.target.value < 0
                              ? setGlobal(10)
                              : setGlobal(0);
                          }}
                        />
                      </div>
                      <div className="add_amount_min_max">
                        <p>
                          {" "}
                          Min: {minLimit}, Max: {maxLimit}
                        </p>
                      </div>
                    </div>

                    <div className="add_amount_buttons_main">
                      <button
                        onClick={() => {
                          setGlobal(100);
                        }}
                      >
                        <span>
                          <img
                            className="mx-1"
                            src="/images/LandingPage_img/global-rupeeIcon.png"
                            alt=""
                            width="20x"
                            height="20x"
                          />
                        </span>{" "}
                        100
                      </button>
                      <button
                        onClick={() => {
                          setGlobal(250);
                        }}
                      >
                        <span>
                          <img
                            className="mx-1"
                            src="/images/LandingPage_img/global-rupeeIcon.png"
                            alt=""
                            width="20x"
                            height="20x"
                          />
                        </span>{" "}
                        250
                      </button>
                      <button
                        onClick={() => {
                          setGlobal(500);
                        }}
                      >
                        <span>
                          <img
                            className="mx-1"
                            src="/images/LandingPage_img/global-rupeeIcon.png"
                            alt=""
                            width="20x"
                            height="20x"
                          />
                        </span>{" "}
                        500
                      </button>
                      <button
                        onClick={() => {
                          setGlobal(2000);
                        }}
                      >
                        <img
                          className="mx-1"
                          src="/images/LandingPage_img/global-rupeeIcon.png"
                          alt=""
                          width="20x"
                          height="20x"
                        />{" "}
                        2000
                      </button>
                    </div>

                    <div className="add_cash_nest_btn">
                      <button
                        type="button"
                        id="addcase"
                        className=""
                        onClick={handleNext}
                      >
                        Next <BsArrowRight className="icons" />
                      </button>
                      {/* {addCaseSetting?.isDeposit ? (
                        <button
                          type="button"
                          id="addcase"
                          className=""
                          onClick={handleNext}
                        >
                          Next <BsArrowRight className="icons" />
                        </button>
                      ) : (
                        <p className="deposit_service" id="depositClose">
                          Deposit services Close for some time
                        </p>
                      )} */}
                    </div>
                  </div>
                </div>
              )}

              {Boolean(next == 2) && (
                <div className="">
                  <>
                    <div className="pb-3">
                      <div className={`${css.games_section}`}>
                        <div className="d-flex position-relative align-items-center justify-content-between">
                          <div className="add_cash_small_haedings">
                            Amount to be added{" "}
                            <img
                              className="mx-1"
                              src="/images/LandingPage_img/global-rupeeIcon.png"
                              alt=""
                              width="20x"
                              height="20x"
                            />
                            <b>{global}</b>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNext(1)}
                            className="samll_btn"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="profile_headings">
                        Pay Through QR CODE
                      </div>

                      {/* PHONE pay  */}
                      {Boolean(!isPhonePayActive) && (
                        <div
                          onClick={() => fetchPaymentUrl()}
                          className="add-fund-box mt-3"
                          style={{ paddingTop: "0px", height: "60px" }}
                        >
                          {isLoading ? (
                            <div
                              className="loaderReturn"
                              style={{ zIndex: "99" }}
                            >
                              <img
                                src={"/images/LandingPage_img/loader1.gif"}
                                style={{ width: "100%" }}
                              />
                            </div>
                          ) : (
                            <div
                              className="d-flex align-items-center"
                              style={{
                                backgroundColor: "#fafafa",
                                border: "1px solid #e0e0e0",
                                borderRadius: "7px",
                              }}
                            >
                              <div
                                className="d-flex align-items-center"
                                style={{
                                  height: "60px",
                                  display: "flex",
                                  textAlign: "center",
                                }}
                              >
                                <img
                                  width="40px"
                                  src="/UPI.png"
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
                                <div className="jss30">
                                  <strong>Pay Now </strong>
                                </div>
                                <div className="jss31"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {/* HOADAPAY */}
                      {Boolean(isHoadaPaypayInActive) && (
                        <div
                          onClick={() => {
                            method.current = "upipay";
                            Hoada("link", "upi", "upipay", "upigateway");
                            setHoadaPay(true);
                          }}
                          className="add-fund-box mt-3"
                          style={{ paddingTop: "0px", height: "60px" }}
                        >
                          <div
                            className="d-flex align-items-center"
                            style={{
                              backgroundColor: "#fafafa",
                              border: "1px solid #e0e0e0",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              className="d-flex align-items-center"
                              style={{
                                height: "60px",
                                display: "flex",
                                textAlign: "center",
                              }}
                            >
                              <img
                                width="40px"
                                src="UPI.png"
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
                              <div className="jss30">
                                <strong>PAY NOW 2</strong>
                              </div>
                              <div className="jss31"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* UPI Gateway */}

                      {Boolean(isCashFreeActive) && (
                        <div
                          onClick={() => {
                            method.current = "upipay";
                            depositUpiGateway(
                              "link",
                              "upi",
                              "upipay",
                              "upigateway"
                            );
                          }}
                          class="add-fund-box mt-3"
                          style={{ paddingTop: "0px", height: "60px" }}
                        >
                          <div
                            class="d-flex align-items-center"
                            style={{
                              backgroundColor: "#fafafa",
                              border: "1px solid #e0e0e0",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              class="d-flex align-items-center"
                              style={{
                                height: "60px",
                                display: "flex",
                                textAlign: "center",
                              }}
                            >
                              <img
                                width="40px"
                                src="UPI.png"
                                alt=""
                                style={{
                                  marginLeft: "7px",
                                  paddingBottom: "10px",
                                  paddingLeft: "3px",
                                  paddingTop: "5px",
                                }}
                              />
                            </div>
                            <div class="d-flex justify-content-center flex-column ml-4">
                              <div class="jss30">
                                <strong>
                                  UPI 1 Deposited :- Payment Below 2000{" "}
                                </strong>
                              </div>
                              <div class="jss31"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      {Boolean(isCashFreeActive) && (
                        <div
                          onClick={() => {
                            method.current = "upipay";
                            depositUpiGateway2(
                              "link",
                              "upi",
                              "upipay",
                              "upigateway"
                            );
                          }}
                          class="add-fund-box mt-3"
                          style={{ paddingTop: "0px", height: "60px" }}
                        >
                          <div
                            class="d-flex align-items-center"
                            style={{
                              backgroundColor: "#fafafa",
                              border: "1px solid #e0e0e0",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              class="d-flex align-items-center"
                              style={{
                                height: "60px",
                                display: "flex",
                                textAlign: "center",
                              }}
                            >
                              <img
                                width="40px"
                                src="UPI.png"
                                alt=""
                                style={{
                                  marginLeft: "7px",
                                  paddingBottom: "10px",
                                  paddingLeft: "3px",
                                  paddingTop: "5px",
                                }}
                              />
                            </div>
                            <div class="d-flex justify-content-center flex-column ml-4">
                              <div class="jss30">
                                <strong>
                                  UPI 2 Deposited :- Payment Above 2000{" "}
                                </strong>
                              </div>
                              <div class="jss31"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mypay */}
                      {Boolean(!isCashFreeActive) && (
                        <div
                          onClick={() => {
                            myPay();
                          }}
                          class="add-fund-box mt-3"
                          style={{ paddingTop: "0px", height: "60px" }}
                        >
                          <div
                            class="d-flex align-items-center"
                            style={{
                              backgroundColor: "#fafafa",
                              border: "1px solid #e0e0e0",
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              class="d-flex align-items-center"
                              style={{
                                height: "60px",
                                display: "flex",
                                textAlign: "center",
                              }}
                            >
                              <img
                                width="40px"
                                src="UPI.png"
                                alt=""
                                style={{
                                  marginLeft: "7px",
                                  paddingBottom: "10px",
                                  paddingLeft: "3px",
                                  paddingTop: "5px",
                                }}
                              />
                            </div>
                            <div class="d-flex justify-content-center flex-column ml-4">
                              <div class="jss30">
                                <strong>Deposit UPI</strong>
                              </div>
                              <div class="jss31"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="Qrcode">
                        {/* Qr code 1 */}
                        {manualData?.isPayNowOne && PayOneImage != "" ? (
                          <div
                            onClick={() => {
                              setNext(3);
                              getImageUrl(PayOneImage);
                            }}
                            className="add-fund-box mt-3"
                            style={{ paddingTop: "0px", height: "60px" }}
                          >
                            {isLoading ? (
                              <div
                                className="loaderReturn"
                                style={{ zIndex: "99" }}
                              >
                                <img
                                  src={"/images/LandingPage_img/loader1.gif"}
                                  style={{ width: "100%" }}
                                />
                              </div>
                            ) : (
                              <div
                                className="d-flex align-items-center"
                                style={{
                                  backgroundColor: "#fafafa",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "7px",
                                }}
                              >
                                <div
                                  className="d-flex align-items-center"
                                  style={{
                                    height: "60px",
                                    display: "flex",
                                    textAlign: "center",
                                  }}
                                >
                                  <img
                                    width="40px"
                                    src="/UPI.png"
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
                                  <div className="jss30">
                                    <strong>QR CODE 1</strong>
                                  </div>
                                  <div className="jss31"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          ""
                        )}

                        {/* Qr code 2 */}
                        {manualData?.isPayNowTwo && PayTwoImage != "" ? (
                          <div
                            onClick={() => {
                              setNext(3);
                              getImageUrl(PayTwoImage);
                            }}
                            className="add-fund-box mt-3"
                            style={{ paddingTop: "0px", height: "60px" }}
                          >
                            {isLoading ? (
                              <div
                                className="loaderReturn"
                                style={{ zIndex: "99" }}
                              >
                                <img
                                  src={"/images/LandingPage_img/loader1.gif"}
                                  style={{ width: "100%" }}
                                />
                              </div>
                            ) : (
                              <div
                                className="d-flex align-items-center"
                                style={{
                                  backgroundColor: "#fafafa",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "7px",
                                }}
                              >
                                <div
                                  className="d-flex align-items-center"
                                  style={{
                                    height: "60px",
                                    display: "flex",
                                    textAlign: "center",
                                  }}
                                >
                                  <img
                                    width="40px"
                                    src="/UPI.png"
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
                                  <div className="jss30">
                                    <strong>QR CODE 2</strong>
                                  </div>
                                  <div className="jss31"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          ""
                        )}

                        {/* Qr code 3 */}
                        {manualData?.isPayNowThree && PayThreeImage != "" ? (
                          <div
                            onClick={() => {
                              setNext(3);
                              getImageUrl(PayThreeImage);
                            }}
                            className="add-fund-box mt-3"
                            style={{ paddingTop: "0px", height: "60px" }}
                          >
                            {isLoading ? (
                              <div
                                className="loaderReturn"
                                style={{ zIndex: "99" }}
                              >
                                <img
                                  src={"/images/LandingPage_img/loader1.gif"}
                                  style={{ width: "100%" }}
                                />
                              </div>
                            ) : (
                              <div
                                className="d-flex align-items-center"
                                style={{
                                  backgroundColor: "#fafafa",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "7px",
                                }}
                              >
                                <div
                                  className="d-flex align-items-center"
                                  style={{
                                    height: "60px",
                                    display: "flex",
                                    textAlign: "center",
                                  }}
                                >
                                  <img
                                    width="40px"
                                    src="/UPI.png"
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
                                  <div className="jss30">
                                    <strong>QR CODE 3</strong>
                                  </div>
                                  <div className="jss31"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          ""
                        )}

                        {/* Qr code 4 */}
                        {manualData?.isPayNowFour && PayFourImage != "" ? (
                          <div
                            onClick={() => {
                              setNext(3);
                              getImageUrl(PayFourImage);
                            }}
                            className="add-fund-box mt-3"
                            style={{ paddingTop: "0px", height: "60px" }}
                          >
                            {isLoading ? (
                              <div
                                className="loaderReturn"
                                style={{ zIndex: "99" }}
                              >
                                <img
                                  src={"/images/LandingPage_img/loader1.gif"}
                                  style={{ width: "100%" }}
                                />
                              </div>
                            ) : (
                              <div
                                className="d-flex align-items-center"
                                style={{
                                  backgroundColor: "#fafafa",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "7px",
                                }}
                              >
                                <div
                                  className="d-flex align-items-center"
                                  style={{
                                    height: "60px",
                                    display: "flex",
                                    textAlign: "center",
                                  }}
                                >
                                  <img
                                    width="40px"
                                    src="/UPI.png"
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
                                  <div className="jss30">
                                    <strong>QR CODE 4</strong>
                                  </div>
                                  <div className="jss31"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          ""
                        )}

                        {/* Qr code 5 */}
                        {manualData?.isPayNowFive && PayFiveImage != "" ? (
                          <div
                            onClick={() => {
                              setNext(3);
                              getImageUrl(PayFiveImage);
                            }}
                            className="add-fund-box mt-3"
                            style={{ paddingTop: "0px", height: "60px" }}
                          >
                            {isLoading ? (
                              <div
                                className="loaderReturn"
                                style={{ zIndex: "99" }}
                              >
                                <img
                                  src={"/images/LandingPage_img/loader1.gif"}
                                  style={{ width: "100%" }}
                                />
                              </div>
                            ) : (
                              <div
                                className="d-flex align-items-center"
                                style={{
                                  backgroundColor: "#fafafa",
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "7px",
                                }}
                              >
                                <div
                                  className="d-flex align-items-center"
                                  style={{
                                    height: "60px",
                                    display: "flex",
                                    textAlign: "center",
                                  }}
                                >
                                  <img
                                    width="40px"
                                    src="/UPI.png"
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
                                  <div className="jss30">
                                    <strong>QR CODE 5</strong>
                                  </div>
                                  <div className="jss31"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </>
                </div>
              )}

              {Boolean(next == 3) && (
                <>
                  <img
                    src={`${EndPoint}/${ImageUrl}`} // Replace with the actual path to your image file
                    alt="QR Image"
                    style={{ width: "90%", display: "block", margin: "auto" }}
                  />
                  <div>
                    <DownloadLink
                      className="results_btn results_btn_cancel mt-3"
                      style={{ width: "50%" }}
                      label=" Download QR"
                      filename={`${EndPoint}/${ImageUrl}`}
                      exportFile={() => "My cached data"}
                    />
                  </div>

                  <div>
                    <button
                      className="results_btn results_btn_win mt-5"
                      onClick={handleShow_won}
                    >
                      {" "}
                      Upload Payment Screenshot
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {Boolean(process) && (
            <div className="loaderReturn" style={{ zIndex: "99" }}>
              <img
                src={"/images/LandingPage_img/loader1.gif"}
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>
      </div>

      <section className="win_modal">
        <Modal
          show={show_won}
          onHide={handleClose_won}
          className="cancel_popup_reason_popup"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div>
              <h3>Upload Payment Screenshot</h3>
              <div>
                <lable className="commaon_label">AMOUNT</lable>
                <input
                  className="commaon_input_box mb-2"
                  type="number"
                  required
                  value={global}
                  onChange={(e) => setGlobal(e.target.value)}
                  placeholder="Enter amount"
                  readOnly
                />
                <lable className="commaon_label mt-4">UTR NUMBER</lable>
                <input
                  className="commaon_input_box"
                  type="text"
                  required
                  value={utr}
                  onChange={(e) => setutr(e.target.value)}
                  placeholder="Enter UTR Number"
                />
              </div>

              <div className={`${css1.doc_upload} mt-4 upload_ss_btn`}>
                <input
                  type="file"
                  onChange={handleChange}
                  accept="image/*"
                  required
                />
                {/* ADDED BY TEAM */}
                {!scrnshot && (
                  <div className="cxy flex-column position-absolute ">
                    <i
                      className="fa-solid fa-arrow-up"
                      style={{ color: "#fff" }}
                    ></i>
                    <div
                      className={`${css1.sideNav_text} mt-2 upload_ss_btn_name`}
                    >
                      Upload screenshot.
                    </div>
                  </div>
                )}
                {scrnshot && (
                  <div className={css1.uploaded}>
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
                      <div
                        className={`${css1.name} `}
                        style={{ color: "#fff" }}
                      >
                        {scrnshot.name}
                      </div>
                      <div className={css1.size}>
                        {(scrnshot.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <div className="image-block">
                      <img
                        src="/images/global-cross.png"
                        width="10px"
                        alt=""
                        onClick={() => {
                          clearImage();
                          handleClose_won();
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ width: "100%", marginTop: "20px" }}>
                <img
                  src={scrnshot1}
                  style={{ width: "100%" }}
                  className="screenshot_img"
                />
              </div>

              {/* {fecthStatus == null && fecthStatus == undefined && (
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-danger mt-3 text-white results_btn w-100"
                  id="post"
                  // onClick={(e) => {
                  //   Result(e);
                  // }}
                  onClick={ManualPayments}
                  disabled={!scrnshot}
                />
              )} */}

              {fecthStatus == null && fecthStatus == undefined && (
                <>
                  {isLoading1 ? (
                    <button className="Login-button cxy" disabled>
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      Loading...
                    </button>
                  ) : (
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-danger mt-3 text-white results_btn w-100"
                      id="post"
                      onClick={ManualPayments}
                      disabled={!scrnshot}
                    />
                  )}
                </>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </section>

      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </>
  );
};

export default Addcase;
