import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../Components/Header'
import Rightcontainer from '../Components/Rightcontainer'
const Gamerules = () => {
  return (
    <div>
      <div
        className='leftContainer'
        style={{ minHeight: '100vh', height: '100%' }}
      >
        <div
          className='leftContainer mb_space'
          style={{ minHeight: '100vh', height: '100%' }}
        >
          <div className='pt-5 mt-5  Orher_page_main_section'>
            <h1 className='profile_headings'>Ludo Rules</h1>

            <div className='row'>
              <div className='col-12'>
                <ol className='rules-list'>
                  <li className='small_para'>
                    यदि आप जान भुजकर Autoexit करते है तो भी आपको 100% Loss कर
                    दिया जायेगा ! यदि दोनों प्लेयर में किसी की काटी खुली नहीं तो
                    उसे हम कैंसिल कर सकते है !
                  </li>
                  <li className='small_para'>
                    यदि एक टोकन बाहर है और घर के पास है तो 30% Loss दिया जायेगा
                    लेकिन यदि गेम खेला गया है और 2 काटी बहार आयी हो तो गेम को
                    लेफ्ट करने वाले को 100% Loss कर दिया जायेगा !
                  </li>
                  <li className='small_para'>
                    Autoexit में यदि 1 टोकन बाहर है तो गेम कैंसिल किया जा सकता
                    है लेकिन यदि आपने गेम जान भुजकर में छोड़ा होगा तो आपको Loss
                    ही दिया जायेगा इसमें अंतिम निर्णय Admin का होगा !
                  </li>
                  <li className='small_para'>
                    यदि आपको लगता है की Opponent ने जानभूझकर गेम को Autoexit में
                    छोड़ा है लेकिन Admin ने कैंसिल कर दिया है तो आपसे वीडियो
                    प्रूफ माँगा जायेगा इसलिए हर गेम को रिकॉर्ड करना जरुरी है !
                    यदि आप वीडियो प्रूफ नहीं देते है तो गेम रिजल्ट एडमिन के
                    अनुसार ही अपडेट किया जायेगा चाहे आप विन हो या गेम कैंसिल हो
                    !
                  </li>
                  <li className='small_para'>
                    Game समाप्त होने के 15 मिनट के अंदर रिजल्ट डालना आवश्यक है
                    अन्यथा Opponent के रिजल्ट के आधार पर गेम अपडेट कर दिया
                    जायेगा चाहे आप जीते या हारे और इसमें पूरी ज़िम्मेदारी आपकी
                    होगी इसमें बाद में कोई बदलाव नहीं किया जा सकता है !
                  </li>
                  <li className='small_para'>
                    Win होने के बाद आप गलत स्क्रीनशॉट डालते है तो गेम को सीधा
                    Cancel कर दिया जायेगा इसलिए यदि आप स्क्रीनशॉट लेना भूल गए है
                    तो पहले Live Chat में एडमिन को संपर्क करे उसके बाद ही उनके
                    बताये अनुसार रिजल्ट पोस्ट करे !
                  </li>
                  <li className='small_para'>
                    दोनों प्लेयर की टोकन (काटी) घर से बाहर न आयी हो तो लेफ्ट
                    होकर गेम कैंसिल किया जा सकता है ! [कैंसिल प्रूफ करने के लिए
                    वीडियो आवश्यक होगा]
                  </li>
                  <li className='small_para'>
                    'कैंसिल' रिजल्ट डालने के बाद गेम प्ले करके जीत जाते है तो
                    उसमे हमारी कोई ज़िम्मेदारी नहीं होगी अतः गेम कैंसिल करने के
                    बाद स्टार्ट न करे अन्यथा वो कैंसिल ही माना जायेगा
                  </li>
                  <li className='small_para'>
                    एक बार रिजल्ट डालने के बाद बदला नहीं जा सकता है इसलिए सोच
                    समझकर रिजल्ट पोस्ट करे गलत रिजल्ट डालने पर पेनल्टी भी लगायी
                    जाएगी चाहे आपने वो गलती से डाला हो या जान भुजकर 
                  </li>
                  <li className='small_para'>
                    Fresh आईडी गेम के मामले में केवल पासा के उपयोग के प्रमाण पर
                    रद्द कर दिया जाएगा गोटी के खुले होने के बावजूद नहीं ? गेम का
                    रिकॉड होना जरूरी है अगर कोई अपनी आईडी का नाम नो फ्रेश कर रका
                    तो नो फ्रेश आईडी ही टेक करे जिनका इंटरेस्ट हो वही टेक करे
                    टेबल को ( इसका अंतिम रिजल्ट एडमिन देगा )
                  </li>
                </ol>
                <h1 className='profile_headings'>कमीशन दरें:</h1>
                <ol className='rules-list'>
                  <li className='small_para'>
                    <span className='small_para'>
                      {' '}
                      Battle below ₹ 250 ,{' '}
                      <b className='small_para'>10% commission</b> will be
                      charged on battle amount.
                    </span>
                    <span className='small_para'>
                      {' '}
                      ₹ 250 से कम की बैटल, बैटल राशि पर{' '}
                      <b className='small_para'>10% कमीशन</b> लिया जाएगा।{' '}
                    </span>
                  </li>
                  <li className='small_para'>
                    <span className='small_para'>
                      Battle between ₹ 250 to ₹ 500,{' '}
                      <b className='small_para'>flat₹ 25</b> commission will be
                      charged.
                    </span>
                    <span className='small_para'>
                      ₹ 250 से ₹ 500 के बीच बैटल,
                      <b className='small_para'>फ्लैट₹ 25 </b> कमीशन लगेगा।{' '}
                    </span>
                  </li>
                  <li className='small_para'>
                    <span className='small_para'>
                      {' '}
                      Battle above ₹ 500,{' '}
                      <b className='small_para'>5% commission</b> will be
                      charged on battle amount.{' '}
                    </span>
                    <span className='small_para'>
                      ₹ 500 से ऊपर की बैटल, बैटल राशि पर <b>5% कमीशन</b>
                       लिया जाएगा
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='rightContainer'>
        <Rightcontainer />
      </div>
    </div>
  )
}
export default Gamerules
