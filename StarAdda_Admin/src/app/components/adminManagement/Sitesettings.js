import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import Gateway from './Gateway'

export const Sitesettings = () => {
  const [WebTitle, setWebTitle] = useState('')
  const [WebsiteName, setWebName] = useState('')
  const [CompanyName, setCompanyName] = useState('')
  const [CompanyAddress, setCompanyAddress] = useState('')
  const [CompanyMobile, setCompanyMobile] = useState('')
  const [Logo, setLogo] = useState('')
  const [SmallLogo, setSmallLogo] = useState('')

  const [LandingImage1, setLandingImage1] = useState('')
  const [LandingImage2, setLandingImage2] = useState('')
  const [LandingImage3, setLandingImage3] = useState('')
  const [LandingImage4, setLandingImage4] = useState('')

  const [isLandingImage1, issetLandingImage1] = useState(true)
  const [isLandingImage2, issetLandingImage2] = useState(true)
  const [isLandingImage3, issetLandingImage3] = useState(true)
  const [isLandingImage4, issetLandingImage4] = useState(true)

  const [version, setVersion] = useState('')

  const [settingId, setSettingId] = useState('')

  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API
  const nodeMode = process.env.NODE_ENV
  if (nodeMode === 'development') {
    var baseUrl = beckendLocalApiUrl
  } else {
    baseUrl = beckendLiveApiUrl
  }

  useEffect(() => {
    const data = axios.get(baseUrl + 'settings/data', {}).then((res) => {
      console.log(res.data)
      setSettingId(res.data._id ? res.data._id : '')
      setWebTitle(res.data.WebTitle)
      setWebName(res.data.WebsiteName)
      setCompanyName(res.data.CompanyName)
      setCompanyAddress(res.data.CompanyAddress)
      setCompanyMobile(res.data.CompanyMobile)
      setLogo(res.data.Logo)
      setSmallLogo(res.data.SmallLogo)
      setLandingImage1(res.data.LandingImage1)
      setLandingImage2(res.data.LandingImage2)
      setLandingImage3(res.data.LandingImage3)
      setLandingImage4(res.data.LandingImage4)
      issetLandingImage1(res.data.isLandingImage1)
      issetLandingImage2(res.data.isLandingImage2)
      issetLandingImage3(res.data.isLandingImage3)
      issetLandingImage4(res.data.isLandingImage4)
      setVersion(res.data.version)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    formData.append('settingId', settingId)
    formData.append('WebTitle', WebTitle)
    formData.append('WebsiteName', WebsiteName)
    formData.append('CompanyName', CompanyName)
    formData.append('CompanyAddress', CompanyAddress)
    formData.append('CompanyMobile', CompanyMobile)
    formData.append('Logo', Logo)
    formData.append('SmallLogo', SmallLogo)
    formData.append('LandingImage1', LandingImage1)
    formData.append('LandingImage2', LandingImage2)
    formData.append('LandingImage3', LandingImage3)
    formData.append('LandingImage4', LandingImage4)
    formData.append('isLandingImage1', isLandingImage1)
    formData.append('isLandingImage2', isLandingImage2)
    formData.append('isLandingImage3', isLandingImage3)
    formData.append('isLandingImage4', isLandingImage4)
    formData.append('version', version)
    const response = await axios.post(baseUrl + `settings`, formData)
    console.log(response.data.status)
    if (response.data.status === 'success') {
      alert('Settings submitted successfully')
    } else {
      alert('Settings Not Submitted')
    }
  }

  useEffect(() => {
    const Logo1 = document.getElementById('Logo')
    const Logo2 = document.getElementById('SmallLogo')
    const LandingImage1 = document.getElementById('LandingImage1')
    const LandingImage2 = document.getElementById('LandingImage2')
    const LandingImage3 = document.getElementById('LandingImage3')
    const LandingImage4 = document.getElementById('LandingImage4')

    Logo1.onchange = (e) => {
      const [file] = Logo1.files
      setLogo(file)
    }
    Logo2.onchange = (e) => {
      const [file] = Logo2.files
      setSmallLogo(file)
    }
    LandingImage1.onchange = (e) => {
      const [file] = LandingImage1.files
      setLandingImage1(file)
    }
    LandingImage2.onchange = (e) => {
      const [file] = LandingImage2.files
      setLandingImage2(file)
    }
    LandingImage3.onchange = (e) => {
      const [file] = LandingImage3.files
      setLandingImage3(file)
    }
    LandingImage4.onchange = (e) => {
      const [file] = LandingImage4.files
      setLandingImage4(file)
    }
  }, [])

  return (
    <>
      <div className="other_page_cards_main">
        <h3 className=" my-3 other_page_cards_heading">Website Settings</h3>

        <h4 className=" my-3 other_page_cards_heading_small">UI Settings</h4>
        <form
          onSubmit={handleSubmit}
          method="patch"
          encType="multipart/form-data"
          className="border_bottom"
          // style={{ backgroundColor: 'rgba(0, 27, 11, 0.734)' }}
        >
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Website Title</label>
              <input
                className="form-control"
                type="text"
                value={WebTitle}
                onChange={(e) => setWebTitle(e.target.value)}
              />
            </div>
            {/* </div>

          <div className="form-row"> */}
            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Website Name</label>
              <input
                className="form-control"
                type="text"
                value={WebsiteName}
                onChange={(e) => setWebName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Commpany Name</label>
              <input
                className="form-control"
                type="text"
                value={CompanyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Commpany Address</label>
              <input
                className="form-control"
                type="text"
                value={CompanyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Commpany Mobile</label>
              <input
                className="form-control"
                type="text"
                value={CompanyMobile}
                onChange={(e) => setCompanyMobile(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Right Logo</label>
              <input
                className="form-control"
                type="file"
                name="Logo"
                id="Logo"
              />
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Left Logo</label>
              <input
                className="form-control"
                type="file"
                name="SmallLogo"
                id="SmallLogo"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Game image (1) </label>
              <input
                className="form-control"
                type="file"
                name="LandingImage1"
                id="LandingImage1"
              />
              <select
                className="form-control"
                name=""
                id=""
                value={isLandingImage1}
                onChange={(e) => issetLandingImage1(e.target.value)}
              >
                <option value="true">on</option>
                <option value="false">off</option>
              </select>
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Game image (2)</label>
              <input
                className="form-control"
                type="file"
                name="LandingImage2"
                id="LandingImage2"
              />
              <select
                className="form-control"
                name=""
                id=""
                value={isLandingImage2}
                onChange={(e) => issetLandingImage2(e.target.value)}
              >
                <option value="true">on</option>
                <option value="false">off</option>
              </select>
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Game image (3)</label>
              <input
                className="form-control"
                type="file"
                name="LandingImage3"
                id="LandingImage3"
              />
              <select
                className="form-control"
                name=""
                id=""
                value={isLandingImage3}
                onChange={(e) => issetLandingImage3(e.target.value)}
              >
                <option value="true">on</option>
                <option value="false">off</option>
              </select>
            </div>

            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">Game image (2)</label>
              <input
                className="form-control"
                type="file"
                name="LandingImage4"
                id="LandingImage4"
              />
              <select
                className="form-control"
                name=""
                id=""
                value={isLandingImage4}
                onChange={(e) => issetLandingImage4(e.target.value)}
              >
                <option value="true">on</option>
                <option value="false">off</option>
              </select>
            </div>
            {/* </div>

          <div className="form-row"> */}
            <div className="form-group col-md-4">
              <label htmlFor="WebsiteName">version</label>

              <input
                className="form-control"
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
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
        <Gateway />
      </div>
    </>
  )
}
