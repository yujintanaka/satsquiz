import React from 'react'

type Props = {
    isHost: boolean;
    QRCODE: string | undefined;
    paid: boolean;
    checkInvoice: (e: React.MouseEvent<HTMLButtonElement>) => void;
  }

const Payout: React.FC<Props> = ({isHost,QRCODE, checkInvoice, paid}) => {
  return (
    <div>
      {isHost && !QRCODE && <h1>Waiting for Invoice</h1>}
      {isHost && QRCODE && <>
        <img src={QRCODE}/>
        <button onClick={checkInvoice}>Check Payment</button>
        {paid && <h2>Payment has gone through</h2>}
        {!paid && <h2>We don't see a payment, click check payment to refresh status</h2>}
      </>}
      {!isHost && !QRCODE && <h1>Waiting for your host to pay up</h1>}
      {!isHost && QRCODE && <img src={QRCODE}/>}

    </div>
  )
}

export default Payout