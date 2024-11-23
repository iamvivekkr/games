import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
// import admindata from '../../components/admindata'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const $ = require("jquery");
$.Datatable = require("datatables.net");

const DepositManual = () => {
  const history = useHistory();
  const [user, setUser] = useState();
  const [allDeposite, SetallDeposite] = useState();
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  //use for pagination..
  let [limit, setLimit] = useState(10);

  const setpageLimit = (event) => {
    let key = event.target.value;
    setLimit(key);
  };
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  //user for searching..
  const [searchList, setSearchList] = useState(0);
  const [searchType, setSearchType] = useState(0);
  const [findByStatus, setFindByStatus] = useState(0);

  //   searching handler
  const searchHandler = (event) => {
    let key = event.target.value;

    setSearchList(key);
  };
  //   search by status handler
  const searchByStatus = (event) => {
    let key = event.target.value;
    setFindByStatus(key);
  };

  //react paginate..
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setPageNumber(currentPage);
    // scroll to the top
    //window.scrollTo(0, 0)
  };

  const profle = () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(
        baseUrl +
          `get/manual/deposit/utr?page=${pageNumber}&_limit=${limit}&_q=${searchList}&_stype=${searchType}&_status=${findByStatus}`,
        { headers }
      )
      .then((res) => {
        setUser(res?.data?.admin);
        setNumberOfPages(res.data.totalPages);
        //$('table').dataTable();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkdeposit = (order_id, order_token, pay_date) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `depositupipay/response`,
        { order_id, order_token, pay_date },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };

  const cash_free_deposit = (order_id, order_token) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `deposit/response`,
        { order_id, order_token },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };
  const phone_deposit = (order_id, order_token) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(baseUrl + `phonpay-request-status?txnId=${order_id}`, { headers })
      .then((res) => {
        console.log(res.data, "res.data");
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };

  const universalCheckDeposit = (
    payment_gatway,
    order_id,
    order_token,
    pay_date
  ) => {
    //alert(payment_gatway);
    if (window.confirm("Are you sure you want to proceed with this payment?")) {
      if (payment_gatway == "razorpay") {
        checkrazorpayPayment(order_id, order_token, pay_date);
      } else if (payment_gatway == "haodapay") {
        haodapay(order_id, order_token, pay_date);
      } else if (payment_gatway == "pinelab") {
        checkPinelabpay(order_id, order_token, pay_date);
      } else if (payment_gatway == "upigateway") {
        checkupigatewaypay(order_id, order_token, pay_date);
      } else if (payment_gatway == "phonepe") {
        checkupigatewayphonepe(order_id, order_token, pay_date);
      } else if (payment_gatway == "paymanual") {
        checkupigatewaypaymanual(order_id, order_token, pay_date, "SUCCESS");
      } else if (!payment_gatway) {
        withdrowFail(order_id);
      } else {
        alert("Nothing found");
      }
    }
  };

  const checkrazorpayPayment = (order_id, order_token) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `razorpaycheck/response`,
        { order_id, order_token },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };

  const haodapay = (order_id, order_token, pay_date) => {
    alert(order_token);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(
        baseUrl + `haodapay-request-status?txnId=` + order_id,
        { order_id, order_token },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };

  const checkupigatewaypay = (order_id, order_token, pay_date) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `depositupipay/response`,
        { order_id, order_token },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };
  const checkupigatewayphonepe = (
    order_id,
    order_token,
    pay_date,
    msg = null
  ) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(baseUrl + `phonpay-request-status?txnId=${order_id}`, { headers })
      .then((res) => {
        console.log(res.data, "res.data");
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };
  const checkupigatewaypaymanual = (
    order_id,
    order_token,
    pay_date,
    status
  ) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `userdipositupdate/${order_id}`,
        { status, status },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };
  const PaymanualReject = async (order_id) => {
    const { value: manualPaymentInput } = await Swal.fire({
      title: "Enter Reject Payment Details",
      input: "text",
      inputPlaceholder: "Enter Reject Msg here",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Payment details cannot be empty!";
        }
      },
    });

    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .post(
        baseUrl + `userdipositupdate/${order_id}`,
        { status: "FAILED", msg: manualPaymentInput },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          // localStorage.removeItem('token');
          // localStorage.removeItem('token');
          // window.location.reload()
        }
      });
  };

  const checkPinelabpay = (order_id, order_token, pay_date) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        baseUrl + `pinelabdesposit/response`,
        { order_id, order_token },
        { headers }
      )
      .then((res) => {
        const icon = res.data.status == "PAID" ? "success" : "danger";
        const title =
          res.data.status == "PAID"
            ? "Deposit submited successfully"
            : "Transaction Failed";
        profle();
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("token");
          window.location.reload();
        }
      });
  };

  const withdrowPass = (id) => {
    const confirm = window.confirm(
      "Are you sure, you want to update to success this deposit?"
    );
    if (confirm) {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          baseUrl + `userdipositupdate/${id}`,
          {
            status: "SUCCESS",
          },
          { headers }
        )
        .then((res) => {
          profle();
          alert("deposit successfully done");
        })
        .catch((e) => {
          //console.log(e);
        });
    }
  };

  const withdrowFail = (id) => {
    const confirm = window.confirm(
      "Are you sure, you want to update to failed this deposit?"
    );
    if (confirm) {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          baseUrl + `userdipositupdate/${id}`,
          {
            status: "FAILED",
          },
          { headers }
        )
        .then((res) => {
          profle();
          alert("deposit successfully reject");
          //console.log(res);
        })
        .catch((e) => {
          //console.log(e);
        });
    }
  };

  // check in

  const dateFormat = (e) => {
    const date = new Date(e);
    const newDate = date.toLocaleString("default", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    });
    return newDate;
  };

  const newdateFormat = (e) => {
    let today = new Date(e);
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = dd + "-" + mm + "-" + yyyy;
    return today;
  };

  useEffect(() => {
    profle();
  }, [pageNumber, limit, searchList, searchType, findByStatus]);

  if (user == undefined) {
    return null;
  }

  const Invoice = (data) => {
    const userData = { data };
    setUser(userData);
    console.log(userData);
    history.push("/Reports/deposit_manual", { userData });
  };

  return (
    <>
      {/* <h4 className='font-weight-bold my-3'>ALL CHALLANGES</h4> */}
      <div className="row mt-5">
        <div className="col-12 grid-margin">
          <div className="card ">
            <div className="card-body text-light table_bg">
              <h4 className="dashboard_heading">Deposit Manual</h4>

              {/* searching */}
              <div className="row">
                <select
                  className="form-control col-sm-3 m-2"
                  id="searchType"
                  name="searchtype"
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="0">Select Search by</option>
                  <option value="Name">Name</option>
                  <option value="Phone">Phone</option>
                  <option value="_id">TxnId</option>
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  className="form-control col-sm-4 m-2"
                  onChange={searchHandler}
                />
                <h5>Or</h5>
                <select
                  className="form-control col-sm-3 m-2"
                  id="findByStatus"
                  name="findByStatus"
                  onChange={searchByStatus}
                >
                  <option value="0">Search Status</option>
                  <option value="FAILED">FAILED</option>
                  <option value="Pending">Pending</option>
                  <option value="pending">pending</option>
                  <option value="PAID">PAID</option>
                  <option value="pending">pending</option>
                  <option value="checkin">Checkin</option>
                </select>
                <select
                  className="form-control col-sm-1 m-1 bg-dark text-light"
                  id="pagelimit"
                  name="pagelimit"
                  onChange={setpageLimit}
                >
                  <option value="10">Set limit</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="500">500</option>
                </select>
              </div>

              <div className="table-responsive">
                <table className="table text-light">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th> ID</th>
                      <th>ORDER ID</th>
                      <th> Phone</th>
                      <th> User</th>
                      <th> UTR</th>
                      <th> ScreenShot</th>
                      <th> Amount </th>
                      <th> Status </th>
                      <th> ----- </th>
                      <th> Date </th>
                      <th> Action </th>
                    </tr>
                  </thead>

                  <tbody>
                    {user &&
                      user.map((data, key) => {
                        console.log(data.order_id);
                        var id = data._id.toString(),
                          ctr = 0;
                        var timestamp = id.slice(ctr, (ctr += 8));
                        var machineID = id.slice(ctr, (ctr += 6));
                        var processID = id.slice(ctr, (ctr += 4));
                        var counter = id.slice(ctr, (ctr += 6));
                        //console.log("id:", id);
                        //console.log("timestamp:", parseInt(timestamp, 16));
                        //console.log("machineID:", parseInt(machineID, 16));
                        //console.log("processID:", parseInt(processID, 16));
                        var counterid = parseInt(timestamp, 16);
                        let currentTime = Date.now();
                        let gameCreatedAt = new Date(data.createdAt).getTime();

                        return (
                          <tr>
                            <td>{key + 1}</td>
                            <td>MSG-{counterid}</td>

                            <td
                              style={{
                                color:
                                  data.payment_gatway === "phonepe"
                                    ? "red"
                                    : "black",
                              }}
                            >
                              {data.payment_gatway === "phonepe" ? (
                                <span>
                                  {data.payment_gatway}-{data._id}
                                  <br />
                                  Order ID: {data?.order_id}
                                </span>
                              ) : (
                                data._id
                              )}
                            </td>

                            <td>
                              {/* {admindata?.user?.user_type == 'Admin' ||
                              admindata?.user?.updateLegalData === true ? (
                                <span className='pl-2'>
                                  {data.User_id ? data.User_id.Phone : ''}
                                </span>
                              ) : ( */}
                              <span className="pl-2">
                                {data.User_id?.Phone
                                  ? "********" +
                                    data.User_id.Phone.toString().slice(-2)
                                  : "-----"}
                              </span>
                              {/* )} */}
                            </td>
                            <td>
                              {data.User_id && (
                                <Link
                                  className="btn btn-sm btn-outline-info"
                                  to={`/user/view_user/${data.User_id._id}`}
                                >
                                  {data.User_id.Name}
                                </Link>
                              )}
                            </td>

                            <td>
                              <span style={{ color: "blue" }}>
                                {data.order_token}
                              </span>
                            </td>
                            <td>
                              <a
                                href={`${baseUrl}${data?.paymentImage}`}
                                target="_blank"
                              >
                                <img
                                  alt=""
                                  src={baseUrl + `${data?.paymentImage}`}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg";
                                  }}
                                  className=""
                                  height={600}
                                />
                              </a>
                            </td>
                            <td>{data.amount}</td>
                            <td className="font-weight-bold text-success">
                              {data.status}
                            </td>

                            <td>
                              {
                                //&& (parseInt(gameCreatedAt) + 7200000) < currentTime
                                data.status != "PAID" &&
                                data.status != "FAILED" ? (
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      universalCheckDeposit(
                                        data.payment_gatway,
                                        data.order_id,
                                        data._id,
                                        data.order_token,
                                        newdateFormat(data.createdAt)
                                      )
                                    }
                                  >
                                    Approve
                                  </button>
                                ) : (
                                  "Checked All"
                                )
                              }

                              {
                                //   <button className="ml-1 btn btn-sm btn-warning" onClick={() => withdrowPass(data._id)}>Success</button>
                              }
                            </td>
                            <td>{dateFormat(data.createdAt).split(",")[0]} </td>
                            <td>
                              {/* <button
                                className='btn btn-primary mr-2'
                                onClick={() => Invoice(data)}
                              >
                                View
                              </button> */}
                              {data.status != "FAILED" &&
                                data.status != "PAID" && (
                                  <>
                                    <button
                                      className="btn btn-danger mr-2"
                                      onClick={() =>
                                        PaymanualReject(data.order_id)
                                      }
                                    >
                                      reject
                                    </button>
                                  </>
                                )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4">
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={numberOfPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepositManual;
