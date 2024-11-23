import React from "react";
import css from "../css/notification.module.css";
import Rightcontainer from "../Components/Rightcontainer";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Table from "react-bootstrap/Table";
const Notification = () => {
  const access_token = localStorage.getItem("token");
  const EndPoint = process.env.REACT_APP_API_URL;

  const notification_list = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${access_token}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${EndPoint}/list-notification/sendto/all?page=1&limit=10`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };
  return (
    <div>
      <div className="leftContainer" style={{ height: "100vh" }}>
        {/*<div
        className="cxy flex-column px-4 text-center"
        style={{ paddingTop: "30%" }}
      >
        <img
          src={process.env.PUBLIC_URL + "/Images/nonotification.png"}
          width="220px"
          className="snip-img"
          alt='no notification'
        />
        <div className={`${css.games_section_title} mt-4`} style={{ fontSize: "1.2em" }}>
          No notification yet!
        </div>
        <div
          className={`${css.games_section_headline} mt-2`}
          style={{ fontSize: "0.85em" }}
        >
          Seems like you haven’t done any activity yet
        </div>
  </div>*/}
        <div className="pt-5 mt-4">
          <div className="text-center">
            <ButtonGroup aria-label="Basic example">
              <Button variant="primary" onClick={notification_list}>
                Infomative
              </Button>
              <Button variant="info">Game</Button>
              <Button variant="success">Transaction</Button>
              <Button variant="warning">Others</Button>
            </ButtonGroup>
            <Table striped bordered hover style={{ marginTop: "10px" }}>
              <tbody>
                <tr>
                  <td>Trans</td>
                  <td>Earned 2000</td>
                  <td>10:00</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </div>
  );
};

export default Notification;
