import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const $ = require("jquery");
$.Datatable = require("datatables.net");

const Withdrawl = () => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const [user, setUser] = useState();
  const [mount, setMount] = useState(false);
  const [disable, setDisable] = useState(false);

  const profle = () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(baseUrl + `temp/withdraw/all/pending`, { headers })
      .then((res) => {
        setUser(res.data);
        $("table").dataTable();

        console.log(user);
      });
  };

  const checkStatus = async (id) => {
    setMount(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(baseUrl + `withdrawlstatus/${id}`, { headers })
      .then((res) => {
        setMount(false);
        console.log(res.data);
        Swal.fire({
          title: res.data.message,
          icon: "info",
          confirmButtonText: "OK",
        });
        profle();
      })
      .catch((e) => {
        setMount(false);
        profle();
        console.log(e);
      });
  };

  const withdrowPass = (id) => {
    const confirm = window.confirm(
      "Are you sure, you want to update to success this payout?"
    );
    if (confirm) {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          baseUrl + `userwithdrawupdate/${id}`,
          {
            status: "SUCCESS",
          },
          { headers }
        )
        .then((res) => {
          profle();
          alert("Payout successfully done");
        })
        .catch((e) => {
          //console.log(e);
        });
    }
  };

  const withdrowFail = (id) => {
    const confirm = window.confirm(
      "Are you sure, you want to update to failed this payout?"
    );
    if (confirm) {
      const access_token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      axios
        .post(
          baseUrl + `userwithdrawupdate/${id}`,
          {
            status: "FAILED",
          },
          { headers }
        )
        .then((res) => {
          profle();
          alert("Payout successfully reject");
          //console.log(res);
        })
        .catch((e) => {
          //console.log(e);
        });
    }
  };
  var pathUrl = baseUrl + `mypay-payout-by-upiId`;
  const PayMethod = "UPI";
  const update = async (amount, type, userID, txnID, reqID, manualPayment) => {
    setDisable(true);
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    //bank

    await Swal.fire({
      title: "Are you sure want to Approve",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
    }).then((res) => {
      if (res.dismiss) {
        setDisable(false);
      }
      if (res?.isConfirmed) {
        // setLoading(true)
        setMount(true);
        setDisable(true);

        axios
          .post(
            pathUrl,
            {
              amount: amount,
              type: type,
              userID: userID,
              txnID: txnID,
              reqID: reqID,
            },
            { headers }
          )
          .then((res) => {
            // setLoading(false)
            setMount(false);
            setDisable(false);
            if (res.data.subCode === "200") {
              Swal.fire({
                title: res.data.message,
                icon: "success",
                confirmButtonText: "OK",
              });
              setTimeout(() => {
                profle();
              }, 1000);
            } else {
              // setLoading(false)
              setMount(false);
              Swal.fire({
                title: res.data.message,
                icon: "danger",
                confirmButtonText: "OK",
              });
              setTimeout(() => {
                profle();
              }, 1000);
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
            setTimeout(() => {
              profle();
            }, 1000);
          });
      }
    });
    // if (PayMethod) {
    //   // setLoading(true)
    //   setMount(true);
    //   setDisable(true);
    //   Swal.fire({ html: `You selected: ${PayMethod}` });

    //   axios
    //     .post(
    //       pathUrl,
    //       {
    //         amount: amount,
    //         type: type,
    //         userID: userID,
    //         txnID: txnID,
    //         reqID: reqID,
    //         refID: manualPaymentInputvalue,
    //       },
    //       { headers }
    //     )
    //     .then((res) => {
    //       // setLoading(false)
    //       setMount(false);
    //       setDisable(false);
    //       if (res.data.subCode === "200") {
    //         console.log("cash res", res);
    //         Swal.fire({
    //           title: res.data.message,
    //           icon: "success",
    //           confirmButtonText: "OK",
    //         });
    //         setTimeout(() => {
    //           profle();
    //         }, 1000);
    //       } else {
    //         // setLoading(false)
    //         setMount(false);

    //         Swal.fire({
    //           title: res.data.message,
    //           icon: "danger",
    //           confirmButtonText: "OK",
    //         });
    //         setTimeout(() => {
    //           profle();
    //         }, 1000);
    //       }
    //     })
    //     .catch((e) => {
    //       setMount(false);
    //       Swal.fire({
    //         title: "Error! try after sometime.",
    //         icon: "error",
    //         confirmButtonText: "OK",
    //       });
    //       console.log(e);
    //       setTimeout(() => {
    //         profle();
    //       }, 1000);
    //     });
    // }
  };
  const reject = async (id) => {
    await Swal.fire({
      title: "Are you sure want to Reject",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
    }).then((res) => {
      if (res.isConfirmed) {
        setMount(true);
        const access_token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };
        axios
          .patch(
            baseUrl + `temp/withdraw/reject/${id}`,
            {
              status: "reject",
            },
            { headers }
          )
          .then((res) => {
            setMount(false);
            if (res.data.error) {
              Swal.fire({
                title: res.data.message,
                icon: "danger",
                confirmButtonText: "OK",
              });
            }
            profle();
          })
          .catch((e) => {
            setMount(false);
            profle();
            console.log(e);
          });
      }
    });
  };

  useEffect(() => {
    profle();
  }, []);

  if (user == undefined) {
    return null;
  }

  return mount ? (
    <div
      className=""
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        zIndex: "9999",
        backgroundColor: "rgb(255, 255, 255)",
      }}
    >
      <img src={"/Loader1.gif"} style={{ width: "150px", height: "80px" }} />
    </div>
  ) : (
    <div className="other_page_cards_main">
      <div className="row ">
        <div className="col-12 grid-margin">
          <div className="">
            <div className="">
              <h4 className="other_page_cards_heading"> Withdrawl Requests</h4>
              <div className="table-responsive">
                <table className="table other_page_table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th> ID</th>
                      <th> Phone no.</th>
                      <th> Username</th>
                      <th> Amount </th>
                      <th> UPI </th>
                      <th> Action </th>
                    </tr>
                  </thead>

                  <tbody>
                    {user &&
                      user.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item._id}</td>
                          <td>{item.user && item.user.Phone}</td>
                          <td>
                            {item.user && (
                              <Link
                                className="btn btn-sm btn-outline-info"
                                to={`/user/view_user/${item.user._id}`}
                              >
                                {item.user.Name}
                              </Link>
                            )}
                          </td>
                          <td>{item.amount}</td>
                          <td>{item?.user?.upi_id}</td>
                          <td>
                            {!mount && item.status == "Pending" && (
                              <>
                                {" "}
                                <button
                                  className="btn btn-primary mr-2"
                                  onClick={() =>
                                    update(
                                      item.amount,
                                      item.type,
                                      item.user._id,
                                      item.txn_id,
                                      item._id
                                    )
                                  }
                                  disabled={disable}
                                >
                                  Approve
                                </button>{" "}
                                <button
                                  className="btn btn-danger mr-2"
                                  onClick={() => reject(item._id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {/* <button
                              type="button"
                              class="btn btn-primary"
                              onClick={() => checkStatus(item._id)}
                            >
                              <i class="fa fa-eye" aria-hidden="true"></i>{' '}
                              status
                            </button> */}
                            {/* {
    (item.status != "SUCCESS" && item.status != "FAILED" && item.status!="reject")? <button className="btn btn-danger mr-2" onClick={() => withdrowFail(item.txn_id)}>Reject By Admin</button> :''
}

{
    (item.status != "SUCCESS" && item.status != "FAILED" && item.status!="reject")? <button className="btn btn-primary mr-2" onClick={() => withdrowPass(item.txn_id)}>Approve By Admin</button>:''
} */}
                          </td>
                          {/* <td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdrawl;
