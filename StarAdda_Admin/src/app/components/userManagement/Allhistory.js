import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';


function Allhistory() {
  const location=useLocation();
  const path = location.pathname.split("/")[3];

  const[all,setAll]=useState("all");
const[kyc,setKyc]=useState("");
const[wallet,setWallet]=useState("");
const [data,setData]=useState([]);
// const[parameter,setParameter]=useState("");

  // console.log(path)
    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    if (nodeMode === "development") {
      var baseUrl = beckendLocalApiUrl;
    } else {
      baseUrl = beckendLiveApiUrl;
    }
    // console.log(data)
    const getHistory = () => {
        let access_token = localStorage.getItem("token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseUrl+`admin/activity/${path}/${all}${kyc}${wallet}`, { headers })
            .then((res) => {
                console.log("all_history",res.data);
                setData(res.data.data)
            }).catch((e) => {
                console.log(e)
            })
    }
    useEffect(()=>{
        getHistory()
    },[all,kyc,wallet])

// const[all,setAll]=useState("");

  return (
    <>
    <div className='mb-4'>
    <ButtonToolbar aria-label="Toolbar with button groups">
    <ButtonGroup className="me-2" aria-label="First group">
      <Button className={all.length>0?"btn btn-secondary":"btn btn-primary"} onClick={()=>{setAll("all");setKyc("");setWallet("")}}>All Activity</Button> 
      <Button className={kyc.length>0?"btn btn-secondary":"btn btn-success"} onClick={()=>{setAll("");setKyc("");setKyc("kyc")}}>Kyc</Button>
       <Button className={wallet.length>0?"btn btn-secondary":"btn btn-info"} onClick={()=>{setAll("");setKyc("");setWallet("wallet")}}>Wallet</Button>
    </ButtonGroup>
    </ButtonToolbar>
    </div>
    {
      all?.length >0  ? (
        <div style={{overflow:"scroll"}}>
        <Table  bordered hover variant="" className='bg-white text-dark' style={{color:"black"}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Action By</th>
            <th>IP</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody style={{color:"black"}}>
        {
          data && data?.map((item,index)=>{
            return <tr className={item.Req_type=="kyc" ? `text-info`:`text-black`}>
            <td>{index+1}</td>
            <td>{item.actionBy.Name}</td>
            <td>{item.ip}</td>
            <td>{item.txn_msg}</td>
            <td>{item.amount==null ? item.amount : 0}</td>
            <td>{item.createdAt.slice(0,10)}{" "}{item.createdAt.slice(11,19)}</td>
          </tr>
          })
        }
        </tbody>
      </Table>
      </div>
      ): kyc.length >0 ? (
        <Table  bordered hover variant="" className='bg-white text-dark' style={{color:"white"}}>
      <thead>
        <tr>
          <th>#</th>
          <th>Action By</th>
          <th>IP</th>
          <th>Description</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
      {
        data && data.map((item,index)=>{
          console.log(item)
          return <tr className="">
          <td>{index+1}</td>
          <td>{item.actionBy.Name}</td>
          <td>{item.ip}</td>
          <td>{item.txn_msg}</td>
          <td>{item.amount==null ? item.amount : 0}</td>
          <td>{item.createdAt.slice(0,10)}{" "}{item.createdAt.slice(11,19)}</td>
        </tr>
        })
      }
      </tbody>
    </Table>
      ):<Table  bordered hover variant="" className='bg-white text-dark' style={{color:"white"}}>
      <thead>
        <tr>
          <th>#</th>
          <th>Action By</th>
          <th>IP</th>
          <th>Description</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
      {
        data && data?.map((item,index)=>{
          console.warn(item)
          return <tr className="">
          <td>{index+1}</td>
          <td>{item.actionBy.Name}</td>
          <td>{item.ip}</td>
          <td>{item.txn_msg}</td>
          <td>{item.amount==null ? item.amount : 0}</td>
          <td>{item.createdAt.slice(0,10)}{" "}{item.createdAt.slice(11,19)}</td>
        </tr>
        })
      }
      </tbody>
    </Table>
    }
   
    
    </>
  );
}

export default Allhistory;