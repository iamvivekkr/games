import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Trans } from "react-i18next";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";

const Navbar = (props) => {
  const [newUPI, setNewUPI] = useState("");
  const [confirmUPI, setConfirmUPI] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [UPI, setUPI] = useState({});
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }
  const access_token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };
  const logout = () => {
    axios
      .post(
        baseUrl + `logout`,
        {
          headers: headers,
        },
        { headers }
      )
      .then((res) => {
        // setUser(res.data)
        localStorage.removeItem("token", "user");
        window.location.reload();
        window.location.assign("/adminlogin");
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          localStorage.removeItem("token", "user");
          localStorage.removeItem("token", "user");
          window.location.assign("/adminlogin");
        }
      });
  };

  const updateUPI = async () => {
    const data = {
      upiId: newUPI,
      id: UPI?._id || null,
    };

    axios
      .post(baseUrl + `update-upi`, data, {
        headers: headers,
      })
      .then((res) => {
        if (res.data?.status) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "UPI Updated Successfully",
          }).then((e) => {
            if (e?.isConfirmed) {
              closeModal();
              setConfirmUPI("");
              setNewUPI("");
            }
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong, please try again later",
        }).then((e) => {
          if (e?.isConfirmed) {
            closeModal();
          }
        });
      });
  };

  const openModal = () => {
    setModalIsOpen(true);
    getUPIID();
  };
  const closeModal = () => setModalIsOpen(false);

  const getUPIID = () => {
    axios
      .get(baseUrl + `get-upi`, { headers })
      .then((res) => {
        if (res.data.status) {
          setUPI(res.data?.data);
          setNewUPI(res?.data?.data?.upiId);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    getUPIID();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!newUPI) {
      return Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Please enter your UPI ID",
      });
    } else if (!upiRegex.test(newUPI) || !upiRegex.test(confirmUPI)) {
      Swal.fire({
        icon: "error",
        title: "Invalid UPI Format",
        text: "Please enter a valid UPI ID in the format username@bankname.",
      });
      return;
    } else if (newUPI !== confirmUPI) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "UPI IDs do not match.",
      });
    } else {
      updateUPI();
    }
  };

  function toggleOffcanvas() {
    document.querySelector(".sidebar-offcanvas").classList.toggle("active");
  }
  function toggleRightSidebar() {
    document.querySelector(".right-sidebar").classList.toggle("open");
  }

  return (
    <nav className="navbar p-0 fixed-top d-flex flex-row">
      <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo-mini" to="/">
          <img src={require("../../assets/images/logo.png")} alt="logo" />
        </Link>
      </div>
      <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
        <button
          className="navbar-toggler align-self-center"
          type="button"
          onClick={() => document.body.classList.toggle("sidebar-icon-only")}
        >
          <span className="mdi mdi-menu"></span>
        </button>
        <ul className="navbar-nav w-100">
          <li className="nav-item w-100">
            <h6>{props.userAname}</h6>
          </li>
        </ul>
        <ul className="navbar-nav navbar-nav-right">
          <Dropdown alignRight as="li" className="nav-item">
            <Dropdown.Toggle
              as="a"
              className="nav-link cursor-pointer no-caret"
            >
              <div className="navbar-profile">
                <img
                  className="img-xs rounded-circle"
                  src="https://cdn-icons-png.flaticon.com/512/2206/2206368.png"
                  alt="profile"
                />

                <p className="mb-0 d-none d-sm-block navbar-profile-name">
                  <Trans>User: {props.usertype}</Trans>
                </p>
                <i className="mdi mdi-menu-down d-none d-sm-block"></i>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">
              <Dropdown.Item onClick={() => logout()} className="preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-logout text-danger"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <p className="preview-subject mb-1 text-dark">
                    <Trans>Log Out</Trans>
                  </p>
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="preview-item">
                <Link to={"/admin/update"} className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-update text-danger"></i>
                  </div>
                </Link>
                <Link to={"/admin/update"} className="preview-item-content">
                  <p className="preview-subject mb-1 text-dark">
                    <Trans>Update Password</Trans>
                  </p>
                </Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="preview-item">
                <Link to={"/admin/profile"} className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-account-circle text-danger"></i>
                  </div>
                </Link>
                <Link to={"/admin/profile"} className="preview-item-content">
                  <p className="preview-subject mb-1 text-dark">
                    <Trans>Profile</Trans>
                  </p>
                </Link>
              </Dropdown.Item>
              <Dropdown.Divider />

              <Dropdown.Item className="preview-item" onClick={openModal}>
                <div to={"/admin/profile"} className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-account-circle text-danger"></i>
                  </div>
                </div>
                <div className="preview-item-content">
                  <p className="preview-subject mb-1 text-dark">
                    <Trans>Update UPI ID</Trans>
                  </p>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          onClick={toggleOffcanvas}
        >
          <span className="mdi mdi-format-line-spacing"></span>
        </button>
      </div>
      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update UPI ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New UPI ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="New UPI ID"
                value={newUPI}
                onChange={(e) => setNewUPI(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm UPI ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Confirm UPI ID"
                value={confirmUPI}
                onChange={(e) => setConfirmUPI(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </nav>
  );
};

export default Navbar;
