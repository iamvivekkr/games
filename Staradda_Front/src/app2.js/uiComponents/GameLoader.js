import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import io from "../Components/socket";
import { useHistory, useLocation } from "react-router-dom";

const GameLoader = () => {
  const [gameCountData, setGameCountData] = useState();
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const history = useHistory();
  useEffect(()=>{
    // alert(1)
    // io.on("autoGameDetails", (data) => {
    //   console.log(data, "autoGameDetails");
    //   setGameCountData(data);
   
    // });

    io.emit("autoGameDetails",path);
    io.on("matchstart", (data) => {
      console.log(data, "matchstart");
      if(data["Accepetd_By"] !== undefined){
        history.push("/viewgame1/" + data._id);
      }
    });
  },[])



  return (
    <div className="leftContainer">
      <Header />
      <div className="game_loader_screen">
        <div className="">
          <div className="loader_inner_main">
            <img src="../images/game-loader.gif" className="img-fluid" />

            <h1>00.01</h1>
            <h2>Finding Players</h2>
            <div className="loader_msg">
              <p>Entry Fees will be refunded if no match is found.</p>
            </div>
          </div>
        </div>
      </div>
      <div>
         <div className="game_loader_screen">
        <div className="">
          <div className="loader_inner_main">
            <div className="loader_avatar_main">
              <div className="">
                <img
                  src="../images/avatars/avatar1.png"
                  className="img-fluid loader_avatar"
                />
                <h3 className="playername">You</h3>
              </div>
              <div className="">
                <img
                  src="../images/Homepage/versus.png"
                  className="img-fluid vs_img"
                />
              </div>
              <div className="">
                <img
                  src="../images/avatars/avatar2.png"
                  className="img-fluid loader_avatar"
                />
                <h3 className="playername">DK Meena</h3>
              </div>
            </div>
            <div className="starts_in_div">
              <p>Start in</p>
              <h1>3</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
     
    </div>
  )
}

export default GameLoader
