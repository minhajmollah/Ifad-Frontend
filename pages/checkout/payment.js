import {useRouter} from 'next/router';

const PaymentStatus = () => {
  const router = useRouter();
  const { status } = router.query;

  return (
    <div style={{ padding: '50px 100px 200px 100px', fontSize: "34px", textAlign: "center" }}>
        {status === "success" &&
        <>
        <p className='mb-4' >Payment Successful</p>
        <div className="mb-4 text-success order-success-message" style={{marginTop: "40px"}}>
                <h2>Thanks for placing your order.</h2>
                {/* <button
                  className="close"
                  onClick={handleCloseButtonClick}
                >
                  ×
                </button> */}
              </div>

        </> }
      {status === "fail" && <p>Payment Failed</p>}
      {status === "cancel" && <p>Payment Canceled</p>}
    </div>
  );
};

export default PaymentStatus;
