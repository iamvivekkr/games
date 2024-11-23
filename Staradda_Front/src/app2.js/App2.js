import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useParams,
} from "react-router-dom";
import Homepage from "./uiComponents/Homepage";
import Landing from "./uiComponents/Landing";
import userLogin from "./uiComponents/Login";
import Mywallet from "./uiComponents/Mywallet";
import Addcase from "./uiComponents/Addcase";
import AddCaseByUPI from "./uiComponents/AddCaseByUPI";
import Pay from "./uiComponents/Pay";
import Withdrawopt from "./uiComponents/Withdrawopt";
import Profile1 from "./uiComponents/Profile1";
import ViewGame1 from "./uiComponents/ViewGame1";
import Gamehistory from "./uiComponents/Gamehistory";
import "animate.css";
import axios from "axios";

import Transactionhistory from "./uiComponents/Transactionhistory";
import Referralhis from "./uiComponents/Referralhis";
import Refer from "./uiComponents/Refer";
import Notification from "./uiComponents/Notification";
import Support from "./uiComponents/Support";

// import Games from './uiComponents/Games';
// import Kyc from './uiComponents/Kyc';
import Kyc2 from "./uiComponents/Kyc2";
// import kyc3 from './uiComponents/kyc3';
import RefundPolicy from "./uiComponents/RefundPolicy";
import terms_condition from "./uiComponents/terms_condition";
import PrivacyPolicy from "./uiComponents/PrivacyPolicy";
import Gamerules from "./uiComponents/Gamerules";
import ResponsibleGaming from "./uiComponents/ResponsibleGaming";
import Return from "./uiComponents/Return";
import Notify from "./uiComponents/Notify";
import Header from "./Components/Header";
import Rightcontainer from "./Components/Rightcontainer";
// import Downloadbutton from "./Components/Downloadbutton";
import Redeem from "./uiComponents/Redeem";
import AboutUs from "./uiComponents/AboutUs";
import socket from "./Components/socket";
import Invoice from "./uiComponents/Invoice";
import { onMessageListener } from "../services/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import Chat from "./uiComponents/Chat";
import Maintenence from "./uiComponents/Maintenence";
import {
  Widget,
  addResponseMessage,
  addUserMessage,
  setQuickButtons,
} from "react-chat-widget";

import "react-chat-widget/lib/styles.css";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import GameLoader from "./uiComponents/GameLoader";

import BetCard from "./uiComponents/BetCard";
import GameLoader1 from "./uiComponents/GameLoader1";
import LudoRich from "./uiComponents/LudoRich";

const App2 = () => {
  // User List

  const [UserData, SetUserData] = useState([]);
  const EndPoint = process.env.REACT_APP_API_URL;

  function UserList() {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2VjMGVlYWQxNmZiZWQ1NzJmNTkwYjQiLCJpYXQiOjE2ODY0MDAzNjl9.nRlnNdQ2DSX7oI_xsT5fPSbIf3o1mzh_9ld9vupP0cg"
    );

    var urlencoded = new URLSearchParams();

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(`${EndPoint}/chat/ticket-list`, requestOptions)
      .then((response) => response.json())
      .then((result) => SetUserData(result))
      .catch((error) => console.log("error", error));
  }

  const [state, setState] = React.useState({
    // top: false,
    // left: false,
    // bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {UserData.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText primary={text?.createdAt} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const { pathname } = useLocation();

  const [isTokenFound, setTokenFound] = useState(null);
  const [notification, setNotification] = useState("");
  const [settinData, setSettingData] = useState(undefined);
  const [show, setShow] = useState(false);
  const [gameCountData, setGameCountData] = useState("");
  // console.log(settinData,"gameCountData")

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    socket.on("websettingGet", (data) => {
      localStorage.setItem("sitSetting", JSON.stringify(data));
      setSettingData(data);
    });

    socket.on("recive-msg", (msgs) => {
      if (msgs?.sender == user?._id) {
        return;
      }
      addResponseMessage(msgs.text);
    });
  }, [socket]);

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        //   console.log(payload)
        console.log(notification);
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        });

        toast.success(
          <div>
            <b>{payload.notification.title}</b>
            <br />
            {payload.notification.body}
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      })
      .catch((err) => console.log("failed: ", err));
  }, [notification]);
  // console.log(isTokenFound)
  // useEffect(() => {
  //   getTokens(setTokenFound);

  // //   handleShow()
  // },[notification])
  function updatedToken() {
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .get(`${EndPoint}/updateToken?firebaseToken=${isTokenFound?.token}`, {
        headers,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  // console.log(paths.pathname.split("/")[2].slice(4))

  const [mount, setMount] = useState(true);
  const history = useHistory();

  const access_token = localStorage.getItem("token");
  const [user, setUser] = useState();
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
        localStorage.clear();
        if (e.response.status == 401) {
          localStorage.removeItem("token");
          // history.pushState("/login")
        }
      });
  };
  const caching = () => {};
  useEffect(() => {
    caching();
    //     if (mount )
    //     {
    //      caches.keys().then((names) => {
    //     names.forEach((name) => {
    //       caches.delete(name);
    //     });
    //   });
    //   setMount(false)
    //     }

    getUser();

    // eslint-disable-next-line
  }, []);

  let imageSrc =
    "https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg"; //Place here your image location

  //Here I'm adding the component
  // renderCustomComponent(Image, {src: imageSrc})
  let buttons = [
    {
      label: "Add Image",
      value: "",
    },
  ];

  setQuickButtons(buttons);

  const handlefileButtonClicked = (e) => {
    document.getElementById("myFileInput").click();
  };

  const [inputValue, setInputValue] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [url, setUrl] = useState("");
  const handleSendMessage = (msg) => {
    if (msg !== "" || isFileSelected) {
      const newMessage = {
        text: msg,
        sender: user?._id,
        media: selectedFile,
      };
      socket.emit("create-msg", newMessage);
      setSelectedFile(null);
      setIsFileSelected(false);
    }
  };
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    var url =
      "https://wolper.com.au/wp-content/uploads/2017/10/image-placeholder.jpg";

    addUserMessage("![this is picture](" + url + ")");
    setIsFileSelected(true);
    setSelectedFile(url);
  };

  return (
    <>
      <div
        className="App"
        // style={{ zIndex: "999", position: "absolute", background: "red" }}
      >
        <Widget
          handleNewUserMessage={handleSendMessage}
          // handleSubmit={(event) => alert()}
          showFileUploader="true"
          profileAvatar={
            JSON.parse(localStorage.getItem("sitSetting")) == "undefined"
              ? ""
              : EndPoint + JSON.parse(localStorage.getItem("sitSetting"))?.Logo
          }
          title={
            <div>
              {/* <Button onClick={List}>Alert</Button> */}
              <div>
                {["right"].map((anchor) => (
                  <React.Fragment key={anchor}>
                    <Button onClick={UserList}>User List</Button>
                    <Drawer
                      style={{ height: "60% !important" }}
                      anchor={anchor}
                      open={state[anchor]}
                      onClose={toggleDrawer(anchor, false)}
                    >
                      {list(anchor)}
                    </Drawer>
                  </React.Fragment>
                ))}
              </div>
              khelo Hub
            </div>
          }
          subtitle="SUPPORT"
          showBadge="false"
          resizable="true"
          emojis="true"
          sendButtonAlt="Send"
          launcherOpenLabel="Open Support"
          chatId="rcw-111"
          autofocus="true"
          handleToggle="rcw-chat-container"
          handleQuickButtonClicked={(event) => handlefileButtonClicked(event)}
        />
      </div>
      <input
        type="file"
        id="myFileInput"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <div className="leftContainer">
        <div>
          <Header user={user} />
        </div>
      </div>

      {!access_token ? (
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/landing" component={Landing} />
          <Route path="/login" component={userLogin} />
          <Route path="/RefundPolicy" component={RefundPolicy} />
          <Route path="/PrivacyPolicy" component={PrivacyPolicy} />
          <Route path="/term-condition" component={terms_condition} />
          <Route path="/about" component={AboutUs} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/contact-us" component={Support} />
          <Route path="/Gamerules" component={Gamerules} />
          <Route path="/responsible-gaming" component={ResponsibleGaming} />
          <Route path="" component={Gamerules} />

          <Redirect to="/login" />
        </Switch>
      ) : (
        <Switch>
          <Route path="/betcard" component={BetCard} />

          <Route path="/transaction-history" component={Transactionhistory} />
          {/* <Route exact path="/transaction" component={Transactionhistory} /> */}
          <Route exact path="/Referral-history" component={Referralhis} />
          <Route exact path="/landing" component={Landing} />
          {/* <Route exact path="/adminlogin" component={Login} /> */}

          <Route exact path="/Gamehistory" component={Gamehistory} />
          {/* <Route exact path="/profile" component={Profile} /> */}

          <Route
            exact
            path="/HomePage/:Game"
            render={() => (
              <Homepage
                walletUpdate={getUser}
                setsocket={socket}
                gameCountData={gameCountData}
              />
            )}
          />
          <Route path="/LudoRich/:Game" component={LudoRich} />
          <Route exact path="/refer" component={Refer} />
          <Route exact path="/Notification" component={Notification} />
          <Route exact path="/" component={Landing} />
          <Route path="/profile" component={Profile1} />
          <Route path="/viewgame1/:id" component={ViewGame1} />
          {/* <Route
            path="/addcase"
            render={() => <Addcase walletUpdate={getUser} />}
          /> */}

          <Route path="/addcase" component={AddCaseByUPI} />

          <Route
            path="/Withdrawopt"
            render={() => <Withdrawopt walletUpdate={getUser} />}
          />
          <Route path="/wallet" component={Mywallet} />
          <Route
            path="/support"
            render={() => <Support handleShow={handleShow} />}
          />

          {/* <Route path="/Games" component={Games} /> */}
          <Route exact path="/landing/:id" component={Landing} />
          {console.log({ user })}
          <Route path="/kyc2" render={() => <Kyc2 user={user} />} />
          <Route path="/Rules" component={Gamerules} />
          <Route path="/RefundPolicy" component={RefundPolicy} />
          <Route path="/PrivacyPolicy" component={PrivacyPolicy} />
          <Route path="/term-condition" component={terms_condition} />
          {/* <Route path="/timer" component={Timer}/> */}
          <Route
            path="/return"
            render={() => <Return walletUpdate={getUser} />}
          />
          <Route path="/notify" component={Notify} />

          <Route
            path="/Redeem"
            render={() => <Redeem walletUpdate={getUser} />}
          />
          <Route path="/contact-us" component={Support} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/Gamerules" component={Gamerules} />
          <Route path="/responsible-gaming" component={ResponsibleGaming} />
          <Route path="/about" component={AboutUs} />
          <Route path="/invoice" component={Invoice} />
          <Route path="/pay-status" component={Pay} />
          <Route path="/maint" component={Maintenence} />

          <Route path="/loader" component={GameLoader} />
          <Route path="/loader1" component={GameLoader1} />
          <Redirect to="/landing" />
        </Switch>
      )}
      <div className="rightContainer">
        <Rightcontainer />
      </div>

      {/* <h2>Install Demo</h2> */}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0 m-0">
          <Chat />
        </Modal.Body>
      </Modal>
    </>
  );
};
export default App2;
