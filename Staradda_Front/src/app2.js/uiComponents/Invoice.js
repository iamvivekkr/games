import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import moment from "moment";
import "./invoice.css";

const Invoice = ({ pageprint, handleClose, show, printRef, invoice_data }) => {
  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transaction Reciept</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="invoice invoicepage" ref={printRef}>
            <table className="table_one boder_bottom w_100">
              <tr className="boder_bottom">
                <th colspan="3">
                  <div className="top_table table-1-head">
                    <div>RECEIPT VOUCHER</div>
                    <div className="font_sm">Original</div>
                  </div>
                </th>
              </tr>
              <tr>
                <td rowSpan="5" className="width_50">
                  <div className="table_1">
                    <h1 className="company_name">MAMA SHAKUNI</h1>
                    <div className="detail">
                      <address>
                        s-24 Alankar Plazz , vidhyadhr Nager Jaipur-302039
                      </address>
                      <div>
                        <strong>GSTIN : </strong>
                        <span>08AAPCM8651H11ZW</span>
                      </div>
                      <div>
                        <strong>MOB:</strong>
                        <span>+91- 9912700255</span>|
                        <span>RKZONES718@gmail.com</span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr className="boder_bottom">
                <td className="text_center width_25 ">
                  <h4 className="date">DATE :</h4>
                  <h4 className="date">Voucher : </h4>
                </td>
                <td className="text_center width_25 ">
                  <h4 className="date">
                    {moment(invoice_data?.DOT).format("DD-MM-YYYY")}
                  </h4>
                  <h4 className="date">MSG-{invoice_data?.counterid}</h4>
                </td>
              </tr>
              <tr className="boder_bottom ">
                <td colspan="2" className="">
                  <p style={{ opacity: 0 }}>.</p>
                </td>
              </tr>
              <tr className="boder_bottom ">
                <td colspan="2" className="text-center ">
                  {" "}
                  <strong> Mode Of Payment / Transaction id </strong>
                </td>
              </tr>
              <tr>
                <td colspan="2" className="">
                  <div className="detail paytment">
                    <div>
                      <span>Payment Method :</span>
                      <span>{invoice_data.payment_gatway}</span>
                    </div>
                    <div>
                      <span>Orer Id :</span>
                      <span>{invoice_data?.order_id}</span>
                    </div>
                    <div>
                      <span>Txn id :</span>
                      <span>{invoice_data.txn_id}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            <div>
              <div className="table_bottom onediv pd_left">
                <div>
                  <span className="ms-1">TO</span>
                  <span>
                    {invoice_data.Name} ({invoice_data.Phone})
                  </span>
                </div>
                <a href="">{invoice_data.Email} </a>
              </div>

              <table className=" w_100 ">
                <tr className="text-center ">
                  <th className="width_5">S.NO.</th>
                  <th className="width_45 ">DESCRIPTION</th>
                  <th className="width-30 ">HSN CODE</th>
                  <th className="width_20 ">AMOUNT</th>
                </tr>
                <tr className="table_2_tr detail ">
                  <td className="text-center width_5 ">1</td>
                  <td className="width_45 pd_left ">
                    Advance Received for Supply of Service
                  </td>
                  <td className="text-center width_30 ">
                    {invoice_data.counterid}
                  </td>

                  <td className="text-center width_20 ">
                    {invoice_data.cardAmount}
                  </td>
                </tr>
                <tr className="text-center  boder_bottom">
                  <td colspan="2"></td>
                  <td className="">
                    {" "}
                    <strong>TOTAL</strong>{" "}
                  </td>
                  <td className="">
                    <strong>{invoice_data.cardAmount}</strong>
                  </td>
                </tr>
              </table>

              <div className="bottom_table">
                <div className="width_55 la">
                  <table className="same_height last">
                    <tr className="boder_bottom">
                      <td>
                        <p className="op"> 1</p>
                      </td>
                    </tr>
                    <tr className="boder_bottom">
                      <td colspan="2" className="pd_left boder-top">
                        <div className="boder-top">
                          <p>
                            <strong>Pay To</strong>
                          </p>
                          <div className="detail2 ">
                            <p> khelo Hub PRIVATE LIMITED </p>
                            <p>
                              <span>Account No :-</span>
                              <span>07263300004243</span>
                            </p>
                            <p>
                              <span>ISFC Code : </span>{" "}
                              <span>YESB0000712 YES BANK</span>
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="detail2 pd_left">Receiver signature</td>
                    </tr>
                  </table>
                </div>

                <div className="width_45 la2">
                  <table className="same_height">
                    <tr className="boder_bottom">
                      <td className="width_25 text_center hei_30">
                        {" "}
                        <div style={{ fontWeight: 500 }}>Round Off</div>
                        <div>
                          <strong>GRAND TOTAL</strong>
                        </div>
                      </td>

                      <td className="width_20 text_center hei_30 ">
                        <div style={{ fontWeight: 500 }}>0</div>{" "}
                        <div>
                          <strong>{invoice_data.cardAmount}</strong>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="text-center width_45 detail2" colspan="2">
                        FOR khelo Hub PRIVATE LIMITED
                        <div> AUTHORRISED SIGNATORY </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                paddingTop: "5px",
              }}
            >
              This is computer generated invoice
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={pageprint}>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Invoice;
