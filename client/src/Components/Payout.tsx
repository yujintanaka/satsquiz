import React, { useState } from 'react'
import './styles/Payout.css'

type Props = {
    isHost: boolean;
    QRCODE: string | undefined;
    paid: boolean;
    checkInvoice: (e: React.MouseEvent<HTMLButtonElement>) => void;
    invoiceURL: string;
  }

const Payout: React.FC<Props> = ({isHost,QRCODE, checkInvoice, paid, invoiceURL}) => {
  const [hidden, setHidden] = useState(true);
  const [spinner, setSpinner] = useState(false);
  const [copyMsg, setCopyMsg] = useState(false);
  function clickEvent(e: React.MouseEvent<HTMLButtonElement>){
    setHidden(true);
    setSpinner(true);
    checkInvoice(e);
    setTimeout(()=>{
      setSpinner(false);
      setHidden(false);
    }, 700)
  }
  function copyToClipboard(){
    navigator.clipboard.writeText(invoiceURL)
    setCopyMsg(true);
    setTimeout(()=>{
      setCopyMsg(false)
    }, 3000)
  }
  
  return (
    <>
    <div className='card payout'>
      {isHost && !QRCODE && <h1>Waiting for Invoice</h1>}
      {isHost && QRCODE && <>
        <img onClick={copyToClipboard} src={QRCODE}/>
        <p>Tap QR code to copy</p>
        <button className='button-5' onClick={clickEvent}>Create Withdraw Links</button>
        {spinner && 
        <svg className="spinner" viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
        }
        {!hidden && <>
          {paid && <h2>Success! You are done here.</h2>}
          {!paid && <p>We couldn't confirm your payment. Try again.</p>}
        </>}
      </>}

        {!isHost && !QRCODE && <h1>Waiting for your host to pay up...</h1>}
        {!isHost && QRCODE && 
        <>
          <img onClick={copyToClipboard} src={QRCODE}/>
          <p>Tap to Copy LNURL Withdraw Link</p>
        </> 
        }
    </div>
    {copyMsg && <div className='copied'>Copied to Clipboard!</div>}
    </>
  )
}

export default Payout