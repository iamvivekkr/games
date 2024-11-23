import axios from "axios";
import React, { useEffect } from "react";
function Notify() {
  var url_string = window.location.href; //window.location.href
  var url = new URL(url_string);
  var order_id = url.searchParams.get("order_id");
  var order_token = url.searchParams.get("order_token");
  const EndPoint = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .post(
        `${EndPoint}/deposit/notify`,
        { order_id, order_token },
        { headers }
      )
      .then((res) => {
        console.log(res.data);

        // window.location.reload()
      });
  }, []);

  return <div>Notify</div>;
}

export default Notify;
