import React, { Component, useEffect, useState } from 'react'
// import { Doughnut } from 'react-chartjs-2';
import CountUp from 'react-countup'
import axios from 'axios'
import Atropos from 'atropos/react'
import './Dashboard.css'
import { Link, useHistory } from 'react-router-dom'
import Conflictgame from './Conflictgame'

const $ = require('jquery')
$.Datatable = require('datatables.net')

const Dashboard = () => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API
  const nodeMode = process.env.NODE_ENV
  if (nodeMode === 'development') {
    var baseUrl = beckendLocalApiUrl
  } else {
    baseUrl = beckendLiveApiUrl
  }

  const history = useHistory()

  const [Admin, setAdmin] = useState()
  const [today, setToday] = useState(false)
  const admin = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `total/admin`, { headers }).then((res) => {
      setAdmin(res.data)
    })
  }

  const [User, setUser] = useState()
  const user123 = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `total/user`, { headers }).then((res) => {
      setUser(res.data)
    })
  }

  const [ACTIVE, setACTIVE] = useState()
  const actives = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios
      .get(baseUrl + `total/active`, { headers })
      .then((res) => {
        setACTIVE(res.data)
      })
      .catch((e) => {
        if (e.response.status === 401) {
          localStorage.removeItem('token')
          history.push('/adminlogin')
          //place your reentry code
        }
      })
  }
  const [BLOCKED, setBLOCKED] = useState()
  useEffect(() => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `total/block`, { headers }).then((res) => {
      setBLOCKED(res.data)
    })
  }, [])

  // CHALLANGE OVERVIEW

  const [COMPLETED, setCOMPLETED] = useState()
  const comp = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `challange/completed`, { headers }).then((res) => {
      setCOMPLETED(res.data)
    })
  }

  const [ACTIVE1, setACTIVE1] = useState()
  const active = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `challange/active`, { headers }).then((res) => {
      setACTIVE1(res.data)
    })
  }

  const [ONGOING, setONGOING] = useState()
  const ongoings = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `challange/running`, { headers }).then((res) => {
      setONGOING(res.data)
    })
  }

  const [CANCELLED, setCANCELLED] = useState()
  const cancelled = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `challange/cancelled`, { headers }).then((res) => {
      setCANCELLED(res.data)
    })
  }

  // deposite api start

  const [totalDeposit, setTotalDeposit] = useState(0)
  const totalDepositfunc = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `total/deposit`, { headers }).then((res) => {
      setTotalDeposit(res.data)
    })
  }
  const [totalPending, setTotalPending] = useState(0)
  const totalPendingfunc = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `count/new/deposit`, { headers }).then((res) => {
      setTotalPending(res.data)
    })
  }
  const [totalRejected, setTotalRejected] = useState(0)
  const totalRejectedfunc = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `count/rejected/deposit`, { headers }).then((res) => {
      setTotalRejected(res.data)
    })
  }

  // deposite api end

  // withdrawl api start

  const [totalWithdrawl, setTotalWithdrawl] = useState(0)
  const totalWithdrawlfunc = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `total/withdraw`, { headers }).then((res) => {
      setTotalWithdrawl(res.data)
    })
  }
  const [totalPendingWithdrawl, setTotalPendingWithdrawl] = useState(0)
  const totalPendingWithdrawlfunc = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `count/new/withdrawl`, { headers }).then((res) => {
      setTotalPendingWithdrawl(res.data)
    })
  }
  const [totalRejectedWithdrawl, setTotalRejectedWithdrawl] = useState(0)
  const totalRejectedWithdrawlfunc = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `count/rejected/withdrawl`, { headers }).then((res) => {
      setTotalRejectedWithdrawl(res.data)
    })
  }

  // witdrawl api end

  const [Some, setSome] = useState()
  const Some1 = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios.get(baseUrl + `challange/some`, { headers }).then((res) => {
      setSome(res.data)
      $('table').dataTable()
    })
  }
  const [todayData, setTodayData] = useState()
  const todayApi = () => {
    const access_token = localStorage.getItem('token')
    const headers = {
      Authorization: `Bearer ${access_token}`,
    }
    axios
      .get(baseUrl + `all/user/data/get`, { headers })
      .then((res) => {
        setTodayData(res.data)
        //console.log(res.data);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    comp()
    actives()
    user123()
    admin()
    active()
    ongoings()
    cancelled()
    totalDepositfunc()
    totalPendingfunc()
    totalWithdrawlfunc()
    totalPendingWithdrawlfunc()
    totalRejectedWithdrawlfunc()
    todayApi()
    // Some1()
  }, [])

  // CHALLANGE OVERVIEW

  return (
    <div className="">
      <Conflictgame />
      {/* <Deposits />
       <Conflictgame/> */}
      <div className="custom-control custom-switch float-right">
        <input
          type="checkbox"
          className="custom-control-input"
          id="customSwitch1"
          onClick={() => setToday((value) => !value)}
        />
        <label className="custom-control-label" htmlFor="customSwitch1">
          {today == false ? 'OVERVIEW' : 'TODAY'}
        </label>
      </div>
      {!today && (
        <div className="mt-3">
          {/* <h3 className="mt-3 dashboard_heading">ALL USER OVERVIEW</h3>
          <div className="row mt-5">
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              shadowOffset={50}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card my-atropos"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg1">
                <div className="card-body text-light">
                  <h4 className="">TOTAL ADMIN</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={Admin && Admin}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg2">
                <div className="card-body text-light">
                  <h4 className="">TOTAL USER</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={User && User}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg3">
                <div className="card-body text-light">
                  <h4 className="">ACTIVE USER</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={ACTIVE && ACTIVE}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg4">
                <div className="card-body text-light">
                  <h4 className="">BLOCKED USER</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={BLOCKED && BLOCKED}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
          </div> */}

          {/* ==========All User Overview================ */}

          <div className="mt-5 card_boxes_main">
            <h3 className=" dashboard_heading">All User Overview</h3>

            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg1">
                    <span class="material-symbols-outlined">group</span>
                  </div>
                  <div className="">
                    <h4>Total Admin</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={Admin && Admin}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg2">
                    <span class="material-symbols-outlined">group</span>
                  </div>
                  <div className="">
                    <h4>Total User</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={User && User}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg3">
                    <span class="material-symbols-outlined">person</span>
                  </div>
                  <div className="">
                    <h4>Active User</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={ACTIVE && ACTIVE}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg4">
                    <span class="material-symbols-outlined">person_off</span>
                  </div>
                  <div className="">
                    <h4>Blocked User</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={BLOCKED && BLOCKED}
                      />
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <h3 className="mt-3 dashboard_heading">CHALLANGE OVERVIEW</h3>
          <div className="row mt-5">
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg5">
                <div className="card-body text-light">
                  <h4 className="">COMPLETED CHALLANGE</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={COMPLETED && COMPLETED}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg6">
                <div className="card-body text-light">
                  <h4 className="">ACTIVE CHALLANGE</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={ACTIVE1 && ACTIVE1}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg7">
                <div className="card-body text-light">
                  <h4 className="">ONGOING CHALLANGE</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={ONGOING && ONGOING}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg8">
                <div className="card-body text-light">
                  <h4 className="">CANCELLED CHALLANGE</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={CANCELLED && CANCELLED}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
          </div> */}

          {/* ==========Challenge Overview================ */}
          <div className="mt-5 card_boxes_main">
            <h3 className=" dashboard_heading">Challenge Overview</h3>

            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg5">
                    <span class="material-symbols-outlined">check_circle</span>
                  </div>
                  <div className="">
                    <h4>Completed Challenge</h4>
                    <h5>
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={COMPLETED && COMPLETED}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg6">
                    <span class="material-symbols-outlined">star</span>
                  </div>
                  <div className="">
                    <h4>Active Challenge</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={ACTIVE1 && ACTIVE1}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg7">
                    <span class="material-symbols-outlined">
                      arrow_right_alt
                    </span>
                  </div>
                  <div className="">
                    <h4>Ongoing Challenge</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={ONGOING && ONGOING}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg8">
                    <span class="material-symbols-outlined">close</span>
                  </div>
                  <div className="">
                    <h4>Cancelled Challenge</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={CANCELLED && CANCELLED}
                      />
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <h3 className="mt-3 dashboard_heading">DEPOSITE OVERVIEW</h3>
          <div className="row mt-5">
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg4 ">
                <div className="card-body text-light">
                  <h4 className="">TOTAL REQUEST</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalDeposit && totalDeposit.count}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg3">
                <div className="card-body text-light">
                  <h4 className="">TOTAL DEPOSIT</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalDeposit && totalDeposit.data}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg2">
                <div className="card-body text-light">
                  <h6 className="">PENDING REQUEST</h6>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalPending && totalPending.count}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos className="col-xl-3 col-sm-6 grid-margin stretch-card">
              <div className="card dashboard_cards dash_cards_bg1">
                <div className="card-body text-light">
                  <h6 className="">REJECTED REQUEST</h6>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalRejected && totalRejected.count}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
          </div> */}

          {/* ============Deposite Overview============ */}
          <div className="mt-5 card_boxes_main">
            <h3 className=" dashboard_heading">Deposite Overview</h3>

            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg4">
                    <span class="material-symbols-outlined">fact_check</span>
                  </div>
                  <div className="">
                    <h4>Total Request</h4>
                    <h5>
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalDeposit && totalDeposit.count}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg3">
                    <span class="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                  </div>
                  <div className="">
                    <h4>Total Deposite</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalDeposit && totalDeposit.data}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg2">
                    <span class="material-symbols-outlined">error</span>
                  </div>
                  <div className="">
                    <h4>Pending Request</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalPending && totalPending.count}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg1">
                    <span class="material-symbols-outlined">close</span>
                  </div>
                  <div className="">
                    <h4>Rejected Request</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalRejected && totalRejected.count}
                      />
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <h3 className="mt-3 dashboard_heading">WITHDRAWL REQUEST OVERVIEW</h3>
          <div className="row mt-5">
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg8">
                <div className="card-body text-light">
                  <h4 className="">TOTAL REQUEST</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalWithdrawl && totalWithdrawl.count}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg7">
                <div className="card-body text-light">
                  <h4 className="">TOTAL WITHDRAWAL</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalWithdrawl && totalWithdrawl.data}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg6">
                <div className="card-body text-light">
                  <h4 className="">PENDING REQUEST</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={
                          totalPendingWithdrawl && totalPendingWithdrawl.count
                        }
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
            >
              <div className="card dashboard_cards dash_cards_bg5">
                <div className="card-body text-light">
                  <h4 className="">CANCELLED REQUEST</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={
                          totalRejectedWithdrawl && totalRejectedWithdrawl.count
                        }
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
          </div> */}

          {/* ============Withdrawl Request Overview============ */}
          <div className="mt-5 card_boxes_main">
            <h3 className=" dashboard_heading">Withdrawl Request Overview</h3>

            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg4">
                    <span class="material-symbols-outlined">fact_check</span>
                  </div>
                  <div className="">
                    <h4>Total Request</h4>
                    <h5>
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalWithdrawl && totalWithdrawl.count}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg3">
                    <span class="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                  </div>
                  <div className="">
                    <h4>Total Withdrawl</h4>
                    <h5>
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={totalWithdrawl && totalWithdrawl.data}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg2">
                    <span class="material-symbols-outlined">error</span>
                  </div>
                  <div className="">
                    <h4>Pending Request</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={
                          totalPendingWithdrawl && totalPendingWithdrawl.count
                        }
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg1">
                    <span class="material-symbols-outlined">close</span>
                  </div>
                  <div className="">
                    <h4>Cancelled Request</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={
                          totalRejectedWithdrawl && totalRejectedWithdrawl.count
                        }
                      />
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {today && (
        <div>
          <div className="mt-5 card_boxes_main">
            <h3 className=" dashboard_heading">Today Report</h3>

            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg4">
                    <span class="material-symbols-outlined">Groups</span>
                  </div>
                  <div className="">
                    <h4>Total User</h4>
                    <h5>
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalUser}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg3">
                    <span class="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                  </div>
                  <div className="">
                    <h4>Total User Wallet Balance</h4>
                    <h5>
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalWalletbalance}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg2">
                    <span class="material-symbols-outlined">person</span>
                  </div>
                  <div className="">
                    <h4>Today User</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayUser}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg1">
                    <span class="material-symbols-outlined">casino</span>
                  </div>
                  <div className="">
                    <h4>Today Game</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalGame}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg5">
                    <span class="material-symbols-outlined">casino</span>
                  </div>
                  <div className="">
                    <h4>Today All Game</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayAllGame}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg6">
                    <span class="material-symbols-outlined">check_small</span>
                  </div>
                  <div className="">
                    <h4>Today Success Game</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todaySuccessGame}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg4">
                    <span class="material-symbols-outlined">close</span>
                  </div>
                  <div className="">
                    <h4>Today Cancel Game</h4>
                    <h5>
                      {' '}
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayCancelGame}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg8">
                    <span class="material-symbols-outlined">payments</span>
                  </div>
                  <div className="">
                    <h4>Today Commission</h4>
                    <h5>
                      {' '}
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayCommission}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg4">
                    <span class="material-symbols-outlined">payments</span>
                  </div>
                  <div className="">
                    <h4>Today Total Deposit</h4>
                    <h5>
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayTotalDeposit}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg3">
                    <span class="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                  </div>
                  <div className="">
                    <h4>Today Total Withdrawl</h4>
                    <h5>
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayTotalWithdraw}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg2">
                    <span class="material-symbols-outlined">
                      currency_rupee
                    </span>
                  </div>
                  <div className="">
                    <h4>Total Won Amount</h4>
                    <h5>
                      {' '}
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totolWonAmount}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg1">
                    <span class="material-symbols-outlined">cancel</span>
                  </div>
                  <div className="">
                    <h4>Total Lose Amount</h4>
                    <h5>
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalLoseAmount}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg1">
                    <span class="material-symbols-outlined">
                      account_balance
                    </span>
                  </div>
                  <div className="">
                    <h4>Total Hold Balance</h4>
                    <h5>
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalHoldBalance}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg5">
                    <span class="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                  </div>
                  <div className="">
                    <h4>Total Withdrawl Hold Balance </h4>
                    <h5>
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalWithdrawHold}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg6">
                    <span class="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                  </div>
                  <div className="">
                    <h4>Total Deposit</h4>
                    <h5>
                      {' '}
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalDeposit}
                      />
                    </h5>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg7">
                    <span class="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                  </div>
                  <div className="">
                    <h4>Total Withdrawl</h4>
                    <h5>
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalWithdrawl}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg8">
                    <span class="material-symbols-outlined">share</span>
                  </div>
                  <div className="">
                    <h4>Total Referral Earnings</h4>
                    <h5>
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalReferralEarning}
                      />
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="card dashboard_cards ">
                  <div className="dash_icon_box dash_cards_bg4">
                    <span class="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                  </div>
                  <div className="">
                    <h4>Total Referral Wallet</h4>
                    <h5>
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalReferralWallet}
                      />
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="row mt-5">
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg1">
                <div className="card-body text-light">
                  <h4 className="">TOTAL USER</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalUser}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg2">
                <div className="card-body text-light">
                  <h4 className="">TOTAL USER WALLET BALANCE</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalWalletbalance}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg3">
                <div className="card-body text-light">
                  <h4 className="">TODAY USER</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayUser}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg4">
                <div className="card-body text-light">
                  <h4 className="">TODAY GAME</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalGame}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg5">
                <div className="card-body text-light">
                  <h4 className="">TODAY ALL GAME</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayAllGame}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg6">
                <div className="card-body text-light">
                  <h4 className="">TODAY SUCCESS GAME</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todaySuccessGame}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg7">
                <div className="card-body text-light">
                  <h4 className="">TODAY CANCEL GAME</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayCancelGame}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg8">
                <div className="card-body text-light">
                  <h4 className="">TODAY CANCEL GAME</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayCancelGame}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg4">
                <div className="card-body text-light">
                  <h4 className="">TODAY COMMISSION</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayCommission}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg3">
                <div className="card-body text-light">
                  <h4 className="">TODAY TOTAL DEPOSIT</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayTotalDeposit}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg2">
                <div className="card-body text-light">
                  <h4 className="">TODAY TOTAL WITHDRAWAL</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.todayTotalWithdraw}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg1">
                <div className="card-body text-light">
                  <h4 className="">TOTAL WON AMOUNT</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totolWonAmount}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg8">
                <div className="card-body text-light">
                  <h4 className="">TOTAL LOSE AMOUNT</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalLoseAmount}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg7">
                <div className="card-body text-light">
                  <h4 className="">TOTAL HOLD BALANCE</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalHoldBalance}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg6">
                <div className="card-body text-light">
                  <h4 className="">TOTAL WITHDRAWAL HOLD BALANCE</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalWithdrawHold}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg5">
                <div className="card-body text-light">
                  <h4 className="">TOTAL DEPOSIT</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalDeposit}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg4">
                <div className="card-body text-light">
                  <h4 className="">TOTAL WITHDRAWAL</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalWithdrawl}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg8">
                <div className="card-body text-light">
                  <h4 className="">TOTAL REFERRAL EARNING</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalReferralEarning}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
            <Atropos
              rotateXMax={15}
              shadowScale={0.7}
              rotateYMax={15}
              stretchX={50}
              className="col-xl-3 col-sm-6 grid-margin stretch-card"
              style={{ height: '11rem' }}
            >
              <div className="card dashboard_cards dash_cards_bg1">
                <div className="card-body text-light">
                  <h4 className="">TOTAL REFERRAL WALLET</h4>
                  <div className="d-flex align-items-center align-self-start">
                    <h3 className="pt-4 display-3">
                      ₹
                      <CountUp
                        start={0}
                        delay={0.1}
                        duration={0.2}
                        end={todayData && todayData.totalReferralWallet}
                      />
                    </h3>
                  </div>
                </div>
              </div>
            </Atropos>
          </div> */}
        </div>
      )}

      <div className="row">
        <div className="col-md-4 grid-margin stretch-card"></div>
      </div>
    </div>
  )
}

export default Dashboard
