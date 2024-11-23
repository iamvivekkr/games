import React, { useState, useEffect, useRef } from "react";
import css from "../css/gamehis.module.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Invoice from "./Invoice";
import { AiOutlineDownload } from "react-icons/ai";
import "./invoice.css";

const Transactionhistory = () => {
  const EndPoint = process.env.REACT_APP_API_URL;
  let printRef = useRef(null);
  function pageprint() {
    let divToPrint = printRef.current;
    let htmlToPrint =
      "" +
      '<style type="text/css">' +
      ".invoice{" +
      "width: 100%;" +
      "}" +
      ".bottom_table{" +
      "display: flex;" +
      "width: 100%;" +
      "}" +
      "td , th{" +
      " height: 35px;" +
      "}" +
      "table h1 , p {" +
      " margin-bottom: 0;" +
      " padding-bottom: 0;" +
      "}" +
      "address{" +
      " margin-bottom: 0;" +
      "}" +
      ".table-1-head{" +
      " padding: 0px 40px ;" +
      " }" +
      ".font_sm{" +
      "  font-size: 11px;" +
      "  font-weight: 100;" +
      "}" +
      ".company_name{" +
      "font-size: 25px;" +
      "font-weight: 700;" +
      "}" +
      ".date{" +
      " font-size: 20px;" +
      "font-weight: 600;" +
      "}" +
      ".detail{" +
      "font-size: 18px;" +
      "font-weight: 500;" +
      "}" +
      ".detail2{" +
      "font-size: 17px;" +
      "font-weight: 500;" +
      "}" +
      ".paytment{" +
      " width: 80%;" +
      "margin: auto;" +
      "}" +
      ".table_1{" +
      "padding: 0px 10px;" +
      " position: relative;" +
      "top: -25px;" +
      "}" +
      ".table_2_tr td{" +
      "padding-bottom: 10px;" +
      "}" +
      ".width_50{" +
      " width: 50%;" +
      "}" +
      ".width_20{" +
      "width: 20%;" +
      "}" +
      ".width_25{" +
      "width: 25%;" +
      "}" +
      ".width_30{" +
      " width: 30%;" +
      "}" +
      ".width_5{" +
      " width: 5%;" +
      " }" +
      ".width_45{" +
      "width: 45%;" +
      "}" +
      ".width_55{" +
      " width: 55%;" +
      "}" +
      ".hei_30{" +
      " max-height: 70px;" +
      "height: 70px;" +
      "}" +
      ".same_height{" +
      " width: 100%;" +
      " height: 231px;" +
      "max-height: 231px;" +
      "}" +
      ".pd_left{" +
      " padding-left: 10px;" +
      "}" +
      ".w_100{" +
      "width: 100%;" +
      "}" +
      ".op{" +
      "opacity: 0;" +
      "}" +
      " .top_table{" +
      "display: flex;" +
      "justify-content: space-between;" +
      "}" +
      ".text_center{" +
      "text-align: center;" +
      "}" +
      ".invoice table , th ,td , tr{" +
      "border: 2px solid black !important;" +
      "border-collapse: collapse;" +
      "}" +
      ".onediv{" +
      "border-left: 2px solid black;" +
      "border-right: 2px solid black;" +
      "}" +
      ".la table ,th ,td ,tr{" +
      "border-right: 0px !important;" +
      "border-top: 0px !important;;" +
      "}" +
      ".la2 table ,th ,td ,tr{" +
      "border-top: 0px !important;;" +
      "}" +
      "</style>";

    htmlToPrint += divToPrint.outerHTML;
    let newWin = window.open("");
    newWin.document.write(htmlToPrint);
    newWin.print();
    newWin.close();
  }

  const [show, setShow] = useState(false);
  const [invoiceData, setInvoiceData] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true);
    setInvoiceData(e);
  };

  const [user, setUser] = useState("");

  let limit = 50;
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios.get(`${EndPoint}/me`, { headers }).then((res) => {
      setUser(res.data);

      //Allgames(res.data._id)
      Allgames(res.data._id, pageNumber, limit);
      // window.location.reload()
    });
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setPageNumber(currentPage);
    // scroll to the top
    //window.scrollTo(0, 0)
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

  const [cardData, setGame] = useState();

  const Allgames = async (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    await axios
      .get(
        `${EndPoint}/temp/deposite/${id}?page=${pageNumber}&_limit=${limit}`,
        { headers }
      )
      .then((res) => {
        setGame(res.data.ress);
        setNumberOfPages(res.data.totalPages);
      });
  };

  useEffect(() => {
    role();
    //eslint-disable-next-line
  }, [pageNumber, limit]);

  return (
    <div>
      <div></div>
      <div
        className="leftContainer"
        style={{ minHeight: "100vh", height: "100%" }}
      >
        {/* pagination */}

        <div className="pt-5">
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

        {/* game-cards */}
        {cardData &&
          cardData.map((card) => {
            var id = card._id.toString(),
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

            if (
              (card.Req_type === "deposit" || card.Req_type === "bonus") &&
              card.status != "FAILED"
            ) {
              var titleMsg = "Cash added";
              if (card.status === "Pending" && card.Req_type === "deposit") {
                var signIcon = <div className="text-danger">(X)</div>;
              } else {
                var signIcon = <div className="text-success">(+)</div>;
              }
            } else if (
              card.Req_type === "withdraw" &&
              card.status != "FAILED"
            ) {
              var titleMsg = "Witdraw using " + card.Withdraw_type;
              var signIcon = <div className="text-danger">(-)</div>;
            } else if (card.Req_type === "penalty" && card.status != "FAILED") {
              var titleMsg = "Penalty";
              var signIcon = <div className="text-danger">(-)</div>;
            } else if (card.status === "Pending" || card.status === "FAILED") {
              var titleMsg = "FAILED";
              var signIcon = <div className="text-danger">(X)</div>;
            } else {
              var titleMsg = "";
              var signIcon = <div className="text-success"></div>;
            }

            return (
              <div
                className={`w-100 mt-3 py-3 d-flex align-items-center ${css.list_item} transaction_history_single_box`}
              >
                {/* map the cardData */}
                <div
                  className={`${css.center_xy} ${css.list_date} mx-2 transaction_history_single_box_date`}
                >
                  <div>{dateFormat(card.createdAt).split(",")[0]}</div>
                  <small>{dateFormat(card.createdAt).split(",")[1]}</small>
                </div>
                <div className={`${css.list_divider_y}`} />
                <div className={`mx-3 d-flex ${css.list_body}`}>
                  <div className="d-flex align-items-center">
                    <picture className="mr-2">
                      <img
                        height="32px"
                        width="32px"
                        src={
                          process.env.PUBLIC_URL +
                          "/images/LandingPage_img/ludo.jpeg"
                        }
                        alt=""
                        style={{ borderRadius: "5px" }}
                      />
                    </picture>
                  </div>

                  <div className="d-flex flex-column font-8">
                    <div className="transaction_history_single_box">
                      <b>{titleMsg}</b>
                      <h6>OrderID: MSG-{counterid}</h6>
                    </div>
                    <div className={`${css.games_section_headline}`}>
                      Status:
                      {card.status === "none" ||
                      (card.status === "Pending" &&
                        card.Req_type === "withdraw")
                        ? "Processing"
                        : card.status === "Pending" &&
                          card.Req_type === "deposit"
                        ? "Cancelled"
                        : card.status}
                      <br></br>
                      {/* {card.txn_msg ? card.txn_msg : ""} */}
                    </div>
                  </div>
                </div>

                <div className="right-0 d-flex align-items-end pr-3 flex-column">
                  {/* <button className={`btn btn-sm ${css.btn_success} ${css.status_badge}`}>
                  PAID
                </button> */}
                  <div className="d-flex float-right font-8">
                    {signIcon}
                    <picture className="ml-1 mb-1">
                      <img
                        alt="img"
                        height="21px"
                        width="21px"
                        src={
                          process.env.PUBLIC_URL +
                          "/images/LandingPage_img/global-rupeeIcon.png"
                        }
                        className="snip-img"
                      />
                    </picture>
                    <span className="pl-1">{card.amount}</span>
                  </div>
                  {card.closing_balance && (
                    <div
                      className={`${css.games_section_headline}`}
                      style={{ fontSize: "0.6em", whiteSpace: "nowrap" }}
                    >
                      closing balance :{card.closing_balance}
                    </div>
                  )}
                  <div
                    className="games-section-headline"
                    style={{ fontSize: "0.6em" }}
                  ></div>
                </div>
                {/* {card?.status == "PAID" ? (
                  <span
                    className=""
                    onClick={() => {
                      handleShow({
                        cardAmount: card.amount,
                        DOT: card.updatedAt,
                        payment_gatway: card.payment_gatway,
                        order_id: card.order_token,
                        txn_id: card._id,
                        counterid: counterid,
                        Email: user.Email,
                        Name: user.Name,
                        Phone: user.Phone,
                      });
                    }}
                  >
                    <span className="fs-3">
                      <AiOutlineDownload
                        style={{ fontSize: "30px", cursor: "pointer" }}
                      />
                    </span>
                  </span>
                ) : (
                  ""
                )} */}
              </div>
            );
          })}
        {cardData && cardData.length === 0 && (
          <div className="text-center">
            <img
              src={process.env.PUBLIC_URL + "/images/notransactionhistory.png"}
              alt="no data"
              width={300}
              height={300}
              className="img-fluid "
              style={{ marginTop: "25%" }}
            />
            <div className="mt-2 history_other_pages">
              <h3 className="">No transaction History</h3>
              <p className=""> You have not made any transaction yet.</p>
            </div>
          </div>
        )}
      </div>
      <div></div>

      <div>
        <Invoice
          pageprint={pageprint}
          handleClose={handleClose}
          show={show}
          printRef={printRef}
          invoice_data={invoiceData}
        />
      </div>
    </div>
  );
};

export default Transactionhistory;
