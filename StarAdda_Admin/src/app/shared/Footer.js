import React, { Component } from "react";
// import { Trans } from 'react-i18next';
import "../dashboard/Dashboard.css";

class Footer extends Component {
  render() {
    return (
      <footer
        className="footer bg-white"
        id="dashFooter"
        style={{ background: "white" }}
      >
        <div className="container-fluid">
          <div className="d-sm-flex justify-content-center justify-content-sm-between py-2 w-100">
            <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
              Copyright ©{" "}
              <a
                href="https://ganeshludo.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ganeshludo.com
              </a>
              2023
            </span>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
