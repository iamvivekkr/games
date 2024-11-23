import React, { useEffect, useState } from "react";
import socket from "../Components/socket";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { GiClick } from "react-icons/gi";
import "./Chat.css";

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [allMsg, setAllMsg] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [url, setUrl] = useState("");
  const EndPoint = process.env.REACT_APP_API_URL;

  const [showChatList, setShowChatList] = useState(false); // Added state for chat list visibility

  const [picture, setPicture] = useState("");
  const openModal = () => {
    setModalShow(true);
  };

  const access_token = localStorage.getItem("token");
  const [user, setUser] = useState({});
  const getUser = () => {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(`${EndPoint}/me`, { headers })
      .then((res) => {
        setUser(res.data);
      })
      .catch((e) => {
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          // history.pushState("/login")
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const generate_url = (picture) => {
    const formData = new FormData();
    formData.append("media", picture);

    fetch("http://localhost:5000/api/generate-url", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => setSelectedFile(json.data[0]));
  };

  const closeModal = () => {
    setModalShow(false);
    setSelectedFile(null);
    setIsFileSelected(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const selectFile = () => {
    document.getElementById("myFileInput").click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    generate_url(file);
    setIsFileSelected(true);
    setSelectedFile(url);
    openModal();
  };

  socket.emit("joinUser", `${socket.id} is joined`);

  const handleSendMessage = () => {
    if (inputValue !== "" || isFileSelected) {
      const newMessage = {
        text: inputValue,
        sender: user?._id,
        media: selectedFile,
      };
      socket.emit("create-msg", newMessage);
      setMessages([...messages, newMessage]);
      setAllMsg([...allMsg, newMessage]);
      setInputValue("");
      setSelectedFile(null);
      setIsFileSelected(false);
      closeModal();
    }
  };

  useEffect(() => {
    socket.on("recive-msg", (msgs) => {
      console.log(allMsg);
      setAllMsg([...allMsg, msgs]);
    });
  }, [messages, socket]);

  const toggleChatList = () => {
    setShowChatList(!showChatList);
  };

  return (
    <>
      <div className={`chat-container ${showChatList ? "chat-list-open" : ""}`}>
        <div className="chat-header">
          <span
            className="chat_list"
            title="chat list"
            onClick={toggleChatList}
          >
            <GiClick />
          </span>
          <span className="chat_header">Chat</span>
        </div>
        {showChatList && (
          <div className="chat_list_cont">
            <div onClick={() => setShowChatList(false)}>Deposit</div>
            <div onClick={() => setShowChatList(false)}>Deposit</div>
            <div onClick={() => setShowChatList(false)}>Deposit</div>
            <div onClick={() => setShowChatList(false)}>Deposit</div>
            <div onClick={() => setShowChatList(false)}>Deposit</div>
          </div>
        )}

        <div className="chat-messages">
          {allMsg &&
            allMsg?.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message?.sender === user?._id
                    ? "user-message"
                    : "admin-message"
                }`}
                style={{
                  flexDirection:
                    message?.sender === user?._id ? "row" : "row-reverse",
                }}
              >
                <div>
                  {message?.media?.length > 0 && (
                    <img
                      src={message.media}
                      className="img-fluid"
                      style={{ height: "200px", width: "150px" }}
                    />
                  )}
                </div>
                <div
                  className="msg_bg"
                  style={{
                    display: message?.text?.length > 0 ? "inline" : "none",
                  }}
                >
                  {message?.text}
                </div>
              </div>
            ))}
        </div>
        <div className="chat-input">
          <input
            type="file"
            id="myFileInput"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <div
            style={{ paddingRight: "3px", cursor: "pointer" }}
            onClick={selectFile}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              style={{
                height: "35px",
                width: "35px",
                color: isFileSelected ? "green" : "black",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="p-1 m-0">
          {selectedFile ? (
            <img
              src={selectedFile}
              className="img-fluid"
              style={{ height: "350px", width: "100%" }}
              alt="Selected file preview"
            />
          ) : (
            <div
              style={{
                display: "flex",
                height: "300px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner animation="border" variant="primary" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="chat_input_modal"
          />
          <button className="modal_button" onClick={handleSendMessage}>
            Send
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Chat;
