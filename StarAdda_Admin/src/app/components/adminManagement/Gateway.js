import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ReactSwitch from 'react-switch'
import axios from 'axios'
import Swal from 'sweetalert2'

const Gateway = () => {
  const [RazorPayout, setRazorpayout] = useState(true)
  const [RazorDeposit, setRazorDeposit] = useState(true)
  const [RazorpayAuto, setRazorpayAuto] = useState(false)
  const [RazorPayKey, setRazorpayKey] = useState()
  const [RazorPaySecretKey, setRazorpaysecretKey] = useState()
  const [AccountName, setAccountName] = useState()
  const [decentroPayout, setdecentropayout] = useState(true)
  const [decentroDeposit, setdecentroDeposit] = useState(true)
  const [pinelabDeposit, setpinelabDeposit] = useState(true)
  const [decentroAuto, setdecentroAuto] = useState(false)
  const [settingId, setSettingId] = useState('')
  const [enable_otp, setEnableOtp] = useState()
  const [isCashFree, setIsCashFree] = useState(false)
  const [PayNowOne, setPayNowOne] = useState(true)
  const [PayNowTwo, setPayNowTwo] = useState(true)
  const [PayNowThree, setPayNowThree] = useState(true)
  const [payNowFour, setPayNowFour] = useState(true)
  const [isPayNowFive, setPayNowFive] = useState(true)


  // images manual payment
const [payOneImage,setPayOneImage] = useState(null)
const [payTwoImage,setPayTwoImage] = useState(null)
const [payThreeImage,setPayThreeImage] = useState(null)
const [payFourImage,setPayFourImage] = useState(null)
const [payFiveImage,setPayFiveImage] = useState(null)
  // console.log(enable_otp)
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API
  const nodeMode = process.env.NODE_ENV
  if (nodeMode === 'development') {
    var baseUrl = beckendLocalApiUrl
  } else {
    baseUrl = beckendLiveApiUrl
  }

  useEffect(() => {
    const data = axios.get(baseUrl + 'gatewaysettings/data', {}).then((res) => {
      console.log(res.data)
      setSettingId(res.data._id ? res.data._id : '')
      setRazorpayout(res.data.RazorPayout)
      setRazorDeposit(res.data.RazorDeposit)
      setRazorpayAuto(res.data.RazorpayAuto)
      setdecentropayout(res.data.decentroPayout)
      setdecentroDeposit(res.data.decentroDeposit)
      setdecentroAuto(res.data.decentroAuto)
      setRazorpayKey(res.data.RazorPayKey)
      setRazorpaysecretKey(res.data.RazorPaySecretKey)
      setAccountName(res.data.AccountName)
      setpinelabDeposit(res.data.pinelabDeposit)
      setEnableOtp(res.data.otp)
      setIsCashFree(res.data.isCashFreeActive)
      setPayNowOne(res.data.isPayNowOne)
      setPayNowTwo(res.data.isPayNowTwo)
      setPayNowThree(res.data.isPayNowThree)
      setPayNowFour(res.data.isPayNowFour)
      setPayNowFive(res.data.isPayNowFive)
      setPayOneImage(res.data.isPayOneImage)
      setPayTwoImage(res.data.isPayTwoImage)
      setPayThreeImage(res.data.isPayThreeImage)
      setPayFourImage(res.data.isPayFourImage)
      setPayFiveImage(res.data.isPayFiveImage)
    })
  }, [])

  const handleSubmit1 = async (e) => {
    e.preventDefault()

    const response = await axios.post(baseUrl + `gatewaysettings`, {
      settingId,
      RazorPayout,
      RazorDeposit,
      RazorpayAuto,
      decentroPayout,
      decentroDeposit,
      decentroAuto,
      RazorPayKey,
      RazorPaySecretKey,
      AccountName,
      pinelabDeposit,
      otp: enable_otp,
      isCashFreeActive: isCashFree,
      PayNowOne,
      PayNowTwo,
      PayNowThree,
      payNowFour,
      isPayNowFive,
      payOneImage,
      payTwoImage,
      payThreeImage,
      payFourImage,
      payFiveImage,
    })
    console.log(response.data.status)
    if (response.data.status === 'success') {
      alert('Settings submitted successfully')
    } else {
      alert('Settings Not Submitted')
    }
  }

  const handleChangePayOne = val => {
    setPayNowOne(val)
  }
  const handleChangePayTwo = val => {
    setPayNowTwo(val)
  }
  const handleChangePayThree = val => {
    setPayNowThree(val)
  }
  const handleChangePayFour = val => {
    setPayNowFour(val)
  }
  const handleChangePayFive = val => {
    setPayNowFive(val)
  }

  const uploadImage = (type)=>{
    if(!type){
      return false;
    }
      var formdata = new FormData();
      if(type == "PayNowOne"){
        formdata.append("status", PayNowOne);
        formdata.append("image", payOneImage);
        formdata.append("settingId", settingId);
      }else if(type == "PayNowTwo"){
        formdata.append("status", PayNowTwo);
        formdata.append("image", payTwoImage);
        formdata.append("settingId", settingId);
      }else if(type == "PayNowThree"){
        formdata.append("status", PayNowThree);
        formdata.append("image", payThreeImage);
        formdata.append("settingId", settingId);
      }else if(type == "PayNowFour"){
        formdata.append("status", payNowFour);
        formdata.append("image", payFourImage);
        formdata.append("settingId", settingId);
      }else{
        formdata.append("status", isPayNowFive);
        formdata.append("image", payFiveImage);
        formdata.append("settingId", settingId);
      }
  
  formdata.append("image_type", type);
  
  
  var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };
  
  fetch(baseUrl+"gatewaysettings/change_qr", requestOptions)
    .then(response => {
      Swal.fire(
        'Success!',
        'Result Submit Successful',
        'success'
      )
      // window.location.reload(true)
    })
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    }

  return (
    <>
      <h4 className="other_page_cards_heading my-3">
        Payment Gateway Settings
      </h4>

      <h5 className="other_page_cards_heading_small my-3">RazorPay</h5>

      <form
        action="gatewaysettings"
        className="form"
        onSubmit={handleSubmit1}
        method="patch"
        enctype="multipart/form-date"
      >
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="buttonrazpay" className="">
              Razorpay Payout
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={RazorPayout}
              onChange={(e) => setRazorpayout(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="buttonrazdep" className="">
              Razorpay Deposit
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={RazorDeposit}
              onChange={(e) => setRazorDeposit(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="buttonrazauto" className="">
              RazorPay Auto
            </label>
            <select
              className="form-control"
              name=""
              id=""
              value={RazorpayAuto}
              onChange={(e) => setRazorpayAuto(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="RazorpayKey">RazorPay Key</label>
            <input
              className="form-control"
              type="text"
              value={RazorPayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
            />
          </div>

          <div className="form-group col-md-4">
            <label htmlFor="RazorpaysecretKey">RazorPay SecretKey</label>
            <input
              className="form-control"
              type="text"
              value={RazorPaySecretKey}
              onChange={(e) => setRazorpaysecretKey(e.target.value)}
            />
          </div>

          <div className="form-group col-md-4">
            <label htmlFor="AccountName">Account Name</label>
            <input
              className="form-control"
              type="text"
              value={AccountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
        </div>

        <h5 className="other_page_cards_heading_small my-3">Decentro</h5>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="buttondecpay" className="">
              Decentro payout
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={decentroPayout}
              onChange={(e) => setdecentropayout(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="buttondecdep" className="">
              Decentro Deposit
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={decentroDeposit}
              onChange={(e) => setdecentroDeposit(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="buttondecdep" className="">
              Decentro Auto
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={decentroAuto}
              onChange={(e) => setdecentroAuto(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
        </div>

        <h5 className="other_page_cards_heading_small my-3">Pinelab</h5>
        <div className="form-row ">
          <div className="form-group col-md-4">
            <label htmlFor="buttondecdep" className="">
              Pinelab Deposit
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={pinelabDeposit}
              onChange={(e) => setpinelabDeposit(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="buttondecdep" className="">
              Enable Otp
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={enable_otp}
              onChange={(e) => setEnableOtp(e.target.value)}
            >
              <option value="1">Enable</option>
              <option value="0">Disable</option>
            </select>
          </div>
          <div className="form-group col-md-4 ">
            <label htmlFor="buttondecdep" className=" ">
              Is Cash Free
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={isCashFree}
              onChange={(e) => setIsCashFree(e.target.value)}
            >
              <option value={true}>Enable</option>
              <option value={false}>Disable</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <button type="submit" className="btn btn-dark">
              submit
            </button>
          </div>
        </div>


      </form>
        {/* Manual payment ///////////////// */}
        <div className='form-group col-md-6'>
                <Card>
                  <Card.Body>
                    <h4 className='dashboard_small_heading_blue'>
                      PAY NOW 1
                    </h4>
                    <Container>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Enable</Col>
                        <Col sm={2}>
                          {' '}
                          <ReactSwitch
                            checked={PayNowOne}
                            onChange={handleChangePayOne}
                            style={{ display: 'none' }}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Image</Col>
                        <Col sm={1}>
                          <input
                            type='file'
                            accept='image/*'
                            name='rkludoPopular'
                            onChange={e =>
                              setPayOneImage(e.target.files[0])
                            }
                            style={{ width: '200px' }}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}></Col>
                        <Col sm={4}>
                        <a href={baseUrl + payOneImage} target='_blank'>
                          <img src={baseUrl + payOneImage} style={{height:"50px", width:"50px"}}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://cdn1.vectorstock.com/i/1000x1000/94/00/selected-stamp-vector-9519400.jpg';
                          }}
                          />
                        </a>
                        </Col>
                        </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>
                          <button type='button' className='btn btn-dark' onClick={e =>uploadImage('PayNowOne')}>
                            submit
                          </button>
                        </Col>
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
              </div>
              <div className='form-group col-md-6'>
                <Card>
                  <Card.Body>
                    <h4 className='dashboard_small_heading_blue'>
                      PAY NOW 2
                    </h4>
                    <Container>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Enable</Col>
                        <Col sm={2}>
                          {' '}
                          <ReactSwitch
                            checked={PayNowTwo}
                            onChange={handleChangePayTwo}
                            style={{ display: 'none' }}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Image</Col>
                        <Col sm={1}>
                          <input
                            type='file'
                            accept='image/*'
                            name='rkludoPopular'
                            onChange={e =>
                              setPayTwoImage(e.target.files[0])
                            }
                            style={{ width: '200px' }}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}></Col>
                        <Col sm={4}>
                        <a href={baseUrl + payTwoImage} target='_blank'>
                          <img src={baseUrl + payTwoImage} style={{height:"50px", width:"50px"}}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://cdn1.vectorstock.com/i/1000x1000/94/00/selected-stamp-vector-9519400.jpg';
                          }}/>
                        </a>
                        </Col>
                        </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>
                        <button type='button' className='btn btn-dark' onClick={e =>uploadImage('PayNowTwo')}>
                            submit
                          </button>
                        </Col>
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
              </div>
              <div className='form-group col-md-6'>
                <Card>
                  <Card.Body>
                    <h4 className='dashboard_small_heading_blue'>
                      PAY NOW 3
                    </h4>
                    <Container>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Enable</Col>
                        <Col sm={2}>
                          {' '}
                          <ReactSwitch
                            checked={PayNowThree}
                            onChange={handleChangePayThree}
                            style={{ display: 'none' }}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Image</Col>
                        <Col sm={1}>
                          <input
                            type='file'
                            accept='image/*'
                            name='rkludoPopular'
                            onChange={e =>
                              setPayThreeImage(e.target.files[0])
                            }
                            style={{ width: '200px' }}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}></Col>
                        <Col sm={4}>
                        <a href={baseUrl + payThreeImage} target='_blank'>
                          <img src={baseUrl + payThreeImage} style={{height:"50px", width:"50px"}}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://cdn1.vectorstock.com/i/1000x1000/94/00/selected-stamp-vector-9519400.jpg';
                          }}
                          />
                        </a>
                        </Col>
                        </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>
                        <button type='button' className='btn btn-dark' onClick={e =>uploadImage('PayNowThree')}>
                            submit
                          </button>
                        </Col>
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
              </div>
              <div className='form-group col-md-6'>
                <Card>
                  <Card.Body>
                    <h4 className='dashboard_small_heading_blue'>
                      PAY NOW 4
                    </h4>
                    <Container>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Enable</Col>
                        <Col sm={2}>
                          {' '}
                          <ReactSwitch
                            checked={payNowFour}
                            onChange={handleChangePayFour}
                            style={{ display: 'none' }}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Image</Col>
                        <Col sm={1}>
                          <input
                            type='file'
                            accept='image/*'
                            name='rkludoPopular'
                            onChange={e =>
                              setPayFourImage(e.target.files[0])
                            }
                            style={{ width: '200px' }}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}></Col>
                        <Col sm={4}>
                        <a href={baseUrl + payFourImage} target='_blank'>
                          <img src={baseUrl + payFourImage} style={{height:"50px", width:"50px"}}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://cdn1.vectorstock.com/i/1000x1000/94/00/selected-stamp-vector-9519400.jpg';
                          }}
                          />
                        </a>
                        </Col>
                        </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>
                        <button type='button' className='btn btn-dark' onClick={e =>uploadImage('PayNowFour')}>
                            submit
                          </button>
                        </Col>
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
              </div>
              <div className='form-group col-md-6'>
                <Card>
                  <Card.Body>
                    <h4 className='dashboard_small_heading_blue'>
                      PAY NOW 5
                    </h4>
                    <Container>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Enable</Col>
                        <Col sm={2}>
                          {' '}
                          <ReactSwitch
                            checked={isPayNowFive}
                            onChange={handleChangePayFive}
                            style={{ display: 'none' }}
                          />
                        </Col>
                      </Row>

                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>Image</Col>
                        <Col sm={1}>
                          <input
                            type='file'
                            accept='image/*'
                            name='rkludoPopular'
                            onChange={e =>
                              setPayFiveImage(e.target.files[0])
                            }
                            style={{ width: '200px' }}
                          />
                        </Col>
                      </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}></Col>
                        <Col sm={4}>
                        <a href={baseUrl + payFiveImage} target='_blank'>
                          <img src={baseUrl + payFiveImage} style={{height:"50px", width:"50px"}}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://cdn1.vectorstock.com/i/1000x1000/94/00/selected-stamp-vector-9519400.jpg';
                          }}
                          />
                        </a>
                        </Col>
                        </Row>
                      <Row
                        style={{ marginRight: '4.25rem', marginTop: '10px' }}
                      >
                        <Col sm={6}>
                        <button type='button' className='btn btn-dark' onClick={e =>uploadImage('isPayNowFive')}>
                            submit
                          </button>
                        </Col>
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
              </div>
    </>
  )
}

export default Gateway
