import React from "react";
import maint from "../Maintenance.svg";
import "../css/maint.css";
const Maintenence = () => {
  return (
    <div
      className="leftContainer mb_space"
      style={{ minHeight: "100vh", height: "100%" }}
    >
      <div className=" ">
        <div
          className="bg_maint"
          style={{ backgroundImage: "url('../images/maint.svg')" }}
        ></div>
        <div className="bg_cont">
          सर्वर की वजह से वेबसाइट को (GANESHLUDO.com) कुछ टाइम तक बंद किया गया हैं
          जल्दी ही वेबसाइट चालू हो जाएगी | सभी का पेमेंट बिल्कुल सुरक्षित है |
        </div>
      </div>
    </div>
  );
};

export default Maintenence;
