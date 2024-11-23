import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import socket from "../../components/socket";

const $ = require("jquery");
$.Datatable = require("datatables.net");

const DepositManualByUTR = () => {
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
  const access_token = localStorage.getItem("token");

  //use for pagination..
  let [limit, setLimit] = useState(10);

  const setpageLimit = (event) => {
    let key = event.target.value;
    setLimit(key);
  };
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  //user for searching..
  const [searchList, setSearchList] = useState("");
  const [searchType, setSearchType] = useState("");
  const [findByStatus, setFindByStatus] = useState("");

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
        setUser(res?.data);
        setNumberOfPages(res.data.totalPages);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    profle();
  }, [searchList, searchType, findByStatus]);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
    socket.on("updateAdminManualDeposit", (data) => {
      profle();
    });
  }, [socket]);
  const updateTransaction = (transactionId, userId, status, statusReason) => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    };

    axios
      .patch(
        `${baseUrl}update/manual/deposit/user-wallet?`,
        {
          transaction_id: transactionId,
          user_id: userId,
          status: status,
          Status_reason: statusReason,
        },
        { headers }
      )
      .then((res) => {
        profle();
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  const handleApproved = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this transaction!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Approve",
    }).then((result) => {
      if (result.isConfirmed) {
        updateTransaction(
          item?._id,
          item?.userData?._id,
          "Approved",
          "Approved"
        );
      }
    });
  };

  const handleReject = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to reject this transaction!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Reject",
    }).then((result) => {
      if (result.isConfirmed) {
        updateTransaction(item?._id, item?.userData?._id, "FAILED", "FAILED");
      }
    });
  };

  const handleShowImage = (path) => {
    Swal.fire({
      imageUrl: path,
      imageWidth: 400,
      confirmButtonColor: "#3085d6",
    }).then(() => {
      console.log("Image shown");
    });
  };

  return (
    <>
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
                  <option value="">Select Search by</option>
                  <option value="Name">Name</option>
                  <option value="Phone">Phone</option>
                  <option value="order_token">UTR NO</option>
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
                  <option value="">Search Status</option>
                  <option value="FAILED">FAILED</option>
                  <option value="pending">Pending</option>
                  <option value="PAID">PAID</option>
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
                        return (
                          <tr>
                            <td>{key + 1}</td>
                            <td>{data?._id}</td>
                            <td>
                              <span className="pl-2">
                                {data.userData?.Phone
                                  ? "********" +
                                    data.userData.Phone.toString().slice(-2)
                                  : "-----"}
                              </span>
                            </td>
                            <td>
                              {data.userData && (
                                <Link
                                  className="btn btn-sm btn-outline-info"
                                  to={`/user/view_user/${data.userData._id}`}
                                >
                                  {data.userData.Name}
                                </Link>
                              )}
                            </td>
                            <td>
                              <span style={{ color: "blue" }}>
                                {data.order_token}
                              </span>
                            </td>
                            <td>
                              <img
                                src={`${baseUrl}${data?.paymentImage}`}
                                className=""
                                height={600}
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleShowImage(
                                    `${baseUrl}${data?.paymentImage}`
                                  )
                                }
                              />
                            </td>
                            <td>{data.amount}</td>
                            <td className="font-weight-bold text-success">
                              {data.status}
                            </td>
                            <td>
                              {data.status != "PAID" && data.status != "FAILED"
                                ? "-----"
                                : "Checked All"}

                              {
                                //   <button className="ml-1 btn btn-sm btn-warning" onClick={() => withdrowPass(data._id)}>Success</button>
                              }
                            </td>
                            <td>{dateFormat(data.createdAt).split(",")[0]} </td>
                            <td>
                              {/* <button
                                className="btn btn-primary mr-2"
                                onClick={() => Invoice(data)}
                              >
                                View
                              </button> */}
                              {data.status != "FAILED" &&
                                data.status != "PAID" && (
                                  <div style={{ display: "flex", gap: "1rem" }}>
                                    <button
                                      className="btn btn-success"
                                      onClick={() => handleApproved(data)}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="btn btn-danger mr-2"
                                      onClick={() => handleReject(data)}
                                    >
                                      reject
                                    </button>
                                  </div>
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

export default DepositManualByUTR;
