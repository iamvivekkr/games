import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Rightcontainer from "../Components/Rightcontainer";
import "../css/terms.css";
import { Interweave } from "interweave";
import axios from "axios";
const EndPoint = process.env.REACT_APP_API_URL;

const Terms_condition = () => {
  const [data, setData] = useState();
  const getdata = () => {
    // e.preventDefault();
    // const access_token = localStorage.getItem('token')
    // const headers = {
    //   Authorization: `Bearer ${access_token}`
    // }
    axios.get(`${EndPoint}/api/term/condition/term-condition`).then((res) => {
      setData(res.data[0].Desc);
      // console.log(res.data[0].Type);
    });
  };
  useEffect(() => {
    getdata();
  }, []);
  return (
    <div>
      <div className="leftContainer">
        <Header />
        <div className="mt-5 py-4 px-3">
          <div className="m-3">
            <h1>Terms &amp; Condition</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Terms &amp; Condition
                </li>
              </ol>
            </nav>
            <h4>1. The Terms</h4>
            <>
              <p className="p4">
                1.1. These Terms and Conditions is a legally binding document
                and is an electronic record in the form of an electronic
                contract formed under Information Technology Act, 2000 and rules
                made thereunder. These Terms and Conditions must be read in
                conjunction with the Terms of Use of the App (hereinafter
                referred to as “Terms of Use”) and the Privacy Policy of the App
                (hereinafter referred to as “Privacy Policy”).These Terms of
                Service (the “Terms”) are a legal and binding agreement between
                users (“Users”) (referred to as the ganeshludo), in relation to all
                games and applications made available by ganeshludo.com (jointly and
                interchangeably referred to as the “Services”), and any
                information, text, graphics, video, sound, pictures, and any
                other materials appearing, sent, uploaded, communicated,
                transmitted or otherwise made available via the abovementioned
                Services (jointly referred to as the “Content”).
              </p>
              <p className="p4">
                1.2. By accessing and/or using the Services, Users agree to be
                bound by these Terms and ganeshludo.com Privacy Policy, as stated on
                paragraph 5.
              </p>
              <p className="p4">
                1.3. Users state that they are of legal age (minimum 18 years of
                age) to access the Services and Content, or if legally possible,
                to access with their legal guardian consent, due authorization
                and agreement with these Terms.
              </p>
              <p className="p4">1.4. IMPORTANT NOTICE:</p>
              <ul className="ul1">
                <li className="li4">
                  THE CONTEST FOR STAKES IS OPEN ONLY TO INDIAN CITIZENS,
                  RESIDING IN INDIA EXCEPT THE RESIDENTS OF THE INDIAN STATES OF{" "}
                  <span className="s3">
                    <strong>
                      ASSAM, ODISHA, NAGALAND, SIKKIM, MEGHALAYA, ANDHRA
                      PRADESH, AND TELANGANA
                    </strong>
                  </span>
                  .
                </li>
                <li className="li4">
                  ganeshludo.com DOES NOT OFFER POKER FOR STAKES WITHIN THE TERRITORY
                  OF GUJARAT. THE RESIDENTS OF GUJARAT HOWEVER ARE NOT
                  RESTRICTED FROM PLAYING THE FREE TO PLAY FORMAT OF POKER,
                  OFFERED BY ganeshludo.com.
                </li>
                <li className="li4">
                  ganeshludo.com DOES NOT OFFER RUMMY FOR STAKES WITHIN THE TERRITORY
                  OF KERALA. THE RESIDENTS OF KERALA HOWEVER ARE NOT RESTRICTED
                  FROM PLAYING THE FREE TO PLAY FORMAT OF RUMMY, OFFERED BY
                  ganeshludo.com.
                </li>
                <li className="li4">
                  CITIZENS AND/OR RESIDENTS OF COUNTRIES OTHER THAN INDIA ARE
                  NOT ELIGIBLE TO PARTICIPATE IN THE CONTEST.
                </li>
                <li className="li4">
                  CASUAL GAMING IS ALLOWED ACROSS ALL STATES; THE GAME IS
                  PERMITTED TO BE PLAYED FOR STAKES IN THE STATES WHICH DO NOT
                  RESTRICT, PROHIBIT THE SAME, AS HIGHLIGHTED IN THESE TERMS.
                </li>
                <li className="li4">
                  IF YOU ARE RESIDING AND/OR ACCESSING THE APP FROM ANY
                  REGION/STATE/COUNTRY WHERE THE CONTEST FOR STAKES IS
                  PROHIBITED OR RESTRICTED BY LAW OR OTHER REASONS, THEN YOU ARE
                  PROHIBITED FROM REGISTERING AND PARTICIPATING IN THE SAID
                  CONTEST. YOU ARE RESPONSIBLE FOR COMPLIANCE OF ANY LAWS THAT
                  ARE APPLICABLE ON YOUR COUNTRY/DOMICILE/STATE/RESIDENCE. IN
                  CASE YOU PARTICIPATE IN THE CONTEST BY MISREPRESENTATION, THEN
                  ganeshludo.com SHALL IN ITS SOLE DISCRETION HAVE THE RIGHT TO
                  DISQUALIFY YOU AT ANY STAGE OF THE PROCESS, FORFEIT ANY PRIZE
                  (AS DEFINED BELOW) AND TAKE LEGAL ACTION AGAINST YOU.
                </li>
                <li className="li4">
                  IF YOU ARE FOUND OR SUSPECTED TO BE DEFRAUDING THE SYSTEMS OF
                  THE CONTEST IN ANY MANNER THEN YOU SHALL BE DEBARRED FROM
                  PARTICIPATING IN THE CONTEST AND ganeshludo.com MAY TAKE LEGAL ACTION
                  AGAINST YOU.
                </li>
                <li className="li4">
                  EMPLOYEES OF ganeshludo.com, ITS RESPECTIVE HOLDING, SUBSIDIARIES,
                  ASSOCIATE COMPANIES AND THIRD-PARTY SERVICE PROVIDERS WHO HAVE
                  BEEN ENGAGED BY ganeshludo.com FOR THE DEVELOPMENT, PROMOTION,
                  ADMINISTRATION OR EXECUTION OF THE CONTEST, AND THEIR
                  FAMILY/HOUSEHOLD MEMBERS ARE NOT ELIGIBLE TO PARTICIPATE IN
                  THE CONTEST.
                </li>
                <li className="li4">
                  IN CASE OF ANY DISPUTE REGARDING THE APP OR THE CONTEST,
                  ganeshludo.com PRIVATE LIMITED’S DECISION SHALL BE FINAL AND BINDING.
                </li>
                <li className="li4">
                  ganeshludo.com RESERVES THE RIGHT TO CHANGE OR MODIFY THIS TERMS AND
                  CONDITIONS FROM TIME TO TIME, PROSPECTIVELY OR
                  RETROSPECTIVELY, AT ITS SOLE DISCRETION AND WITHOUT ANY PRIOR
                  INTIMATION TO YOU. YOU ARE REQUESTED TO CAREFULLY READ THESE
                  TERMS AND CONDITIONS FROM TIME TO TIME BEFORE USING THE APP OR
                  PARTICIPATING IN CONTEST. IT SHALL BE YOUR RESPONSIBILITY TO
                  CHECK THESE TERMS AND CONDITIONS PERIODICALLY FOR CHANGES.
                  ganeshludo.com PRIVATE LIMITED MAY REQUIRE YOU TO PROVIDE YOUR DIRECT
                  OR INDIRECT CONSENT TO ANY UPDATE IN A SPECIFIED MANNER BEFORE
                  FURTHER USE OF APP OR PARTICIPATION IN THE CONTEST. IF NO SUCH
                  SEPARATE CONSENT IS SOUGHT, YOUR CONTINUED USE OF APP OR
                  PARTICIPATION IN THE CONTEST, FOLLOWING SUCH CHANGES, WILL
                  CONSTITUTE YOUR ACCEPTANCE OF THOSE CHANGES.
                </li>
                <li className="li4">
                  ganeshludo.com RESERVES THE RIGHT TO WITHDRAW OR DISCONTINUE OR
                  TERMINATE THE CONTEST AT ANY STAGE WITHOUT PRIOR NOTICE AND
                  WITHOUT ANY LIABILITY WHATSOEVER TO YOU.
                </li>
                <li className="li4">
                  THE CONTEST IS VOID WHERE PROHIBITED BY LAW.
                </li>
                <li className="li4">
                  IN ANY CONTEST, INCASE OF A DRAW/TIE, THE FINAL DECISION WOULD
                  BE OF THE COMPANY. THERE WOULD BE NO REFUNDS IN ANY SITUATION.
                </li>
              </ul>
            </>
          </div>
        </div>
      </div>
      <div className="rightContainer">
        <Rightcontainer />
      </div>
    </div>
  );
};
export default Terms_condition;
