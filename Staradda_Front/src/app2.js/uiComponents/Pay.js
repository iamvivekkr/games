import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import socket from "../Components/socket";
const Pay = () => {
  const access_token = localStorage.getItem("token");
  const EndPoint = process.env.REACT_APP_API_URL;
  const { search } = useLocation();
  const history = useHistory();
  useEffect(() => {
    var myHeaders = new Headers();

    // console.log(search.split("=")[1])
    myHeaders.append("Authorization", `Bearer ${access_token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `${EndPoint}/phonpay-request-status?txnId=${search.split("=")[1]}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        if (result) {
          Swal.fire({
            title: result.message,
            icon: result.message == "Payment Failed" ? "error" : "success",
            confirmButtonText: "OK",
          });
          if (result.code == "PAYMENT_SUCCESS") {
            socket.emit("getprofile");
          }
          history.push("/addcase");
        }
      })
      .catch((error) => console.log("error", error));
  }, []);
  return <div></div>;
};

export default Pay;
