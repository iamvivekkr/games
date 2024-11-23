import React, { useEffect, useState } from "react";
import { Interweave } from "interweave";
import axios from "axios";

function AboutUs() {
  const [data, setData] = useState();
  const EndPoint = process.env.REACT_APP_API_URL;

  const getdata = () => {
    // e.preventDefault();
    // const access_token = localStorage.getItem('token')
    // const headers = {
    //   Authorization: `Bearer ${access_token}`
    // }
    axios.get(`${EndPoint}/api/term/condition/About-Us`).then((res) => {
      setData(res.data[0].Desc);
      // console.log(res.data[0].Type);
    });
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <div className="px-3 py-4 mt-5">
      <Interweave content={data && data} />
    </div>
  );
}

export default AboutUs;
