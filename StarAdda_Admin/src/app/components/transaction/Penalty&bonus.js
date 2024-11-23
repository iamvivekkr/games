import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
const $ = require("jquery");
$.Datatable = require("datatables.net");
export default function Penaltybonus() {
  const [data, setUser] = useState();
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

  //react paginate..
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setPageNumber(currentPage);
    // scroll to the top
    //window.scrollTo(0, 0)
  };

  //   searching handler
  const searchHandler = (event) => {
    let key = event.target.value;
    setSearchList(key);
  };

  const Alluser = () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(
        baseUrl +
          `User/all/panelty?page=${pageNumber}&_limit=${limit}&_q=${searchList}&_stype=${searchType}`,
        { headers }
      )
      .then((res) => {
        //setUser(res.data)
        setUser(res.data.admin);
        setNumberOfPages(res.data.totalPages);
        //$('table').dataTable();
      });
  };

  const [type, setType] = useState();
  const [bonus, setBonus] = useState();
  console.log(type);
  const update = (id) => {
    if (!bonus) {
      return Swal.fire({
        title: "Error",
        text: "Please Enter Amount",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#3085d6",
      });
    }
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    if (type === "bonus") {
      const confirm = window.confirm(
        "Are you sure, you want to add bonus to this user?"
      );
      if (confirm) {
        axios
          .post(
            baseUrl + `user/bonus/${id}`,
            {
              bonus: JSON.parse(bonus),
            },
            { headers }
          )
          .then((res) => {
            Swal.fire({
              title: "Success",
              text: "Bonus added successfully",
              icon: "success",
            }).then(() => {
              setBonus("");
            });
            Alluser();
          });
      }
    } else if (type == "wallet_balance") {
      const confirm = window.confirm("Are you sure ?");
      if (confirm) {
        axios
          .post(
            baseUrl + `user/wallet_balance/${id}`,
            {
              bonus: JSON.parse(bonus),
            },
            { headers }
          )
          .then((res) => {
            Alluser();
          });
      }
    } else if (type == "withdraw_amt") {
      const confirm = window.confirm("Are you sure ?");
      if (confirm) {
        axios
          .post(
            baseUrl + `user/withdraw_amt/${id}`,
            {
              bonus: JSON.parse(bonus),
            },
            { headers }
          )
          .then((res) => {
            Alluser();
          });
      }
    } else {
      const confirm2 = window.confirm(
        "Are you sure, you want to add penalty to this user?"
      );
      if (confirm2) {
        axios
          .post(
            baseUrl + `user/penlaty/${id}`,
            {
              bonus: JSON.parse(bonus),
            },
            { headers }
          )
          .then((res) => {
            Swal.fire({
              title: "Success",
              text: "Penalty added successfully",
              icon: "success",
            }).then(() => {
              setBonus("");
            });
            Alluser();
          });
      }
    }
  };

  useEffect(() => {
    Alluser();
  }, [pageNumber, limit, searchList, searchType]);

  return (
    <>
      <div className="other_page_cards_main">
        {/* <h4 className='font-weight-bold my-3'>ALL CHALLANGES</h4> */}
        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="">
              <div
                className=""
                // style={{ backgroundColor: 'rgba(0, 27, 11, 0.734)' }}
              >
                <h4 className="other_page_cards_heading ">penalty and Bonus</h4>
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
                    <option value="_id">User Id</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control col-sm-4 m-2"
                    onChange={searchHandler}
                  />
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
                <div className="table-responsive mt-3">
                  <table className="table other_page_table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th> ID</th>
                        <th> Name</th>
                        <th> Mobile </th>
                        <th> Balance </th>
                        <th> Action </th>
                      </tr>
                    </thead>

                    <tbody>
                      {data &&
                        data.map((data, key) => (
                          <tr role="row" className="odd">
                            <td className="sorting_1">{key + 1}</td>
                            <td>{data._id}</td>
                            <td>{data.Name}</td>
                            <td>{data.Phone}</td>
                            <td>{data.Wallet_balance}</td>
                            <td>
                              <div className="row">
                                <div className="col-12 col-lg-5">
                                  <input
                                    id="number"
                                    type="number"
                                    className="form-control input-sm"
                                    style={{ minWidth: "100px" }}
                                    placeholder="Amount"
                                    // value={bonus}
                                    onChange={(e) => setBonus(e.target.value)}
                                  />
                                </div>
                                <div className="col-12 col-lg-4">
                                  <div className="form-group">
                                    <select
                                      className="form-control input-sm"
                                      name="type"
                                      style={{ minWidth: "100px" }}
                                      onChange={(e) => setType(e.target.value)}
                                    >
                                      <option value="penalty">Penalty</option>
                                      <option value="bonus">Bonus</option>
                                      {/* {data.iswalletUpdate == 0?<><option value="wallet_balance" >Wallet Balance</option></>:''} */}

                                      {/* <option value="withdraw_amt">Withdrawable Amount</option> */}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-12 col-lg-3">
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => update(data._id)}
                                  >
                                    UPDATE
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
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
      </div>
    </>
  );
}
