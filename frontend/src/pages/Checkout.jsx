import API from "../services/api";

function Checkout() {

  const handlePayment = async () => {
    try {
      const res = await API.post("/payment/create-checkout-session");

      // 🔥 Redirect to Stripe
      window.location.href = res.data.url;

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>

      <button onClick={handlePayment} className="btn-primary">
        Pay Now
      </button>
    </div>
  );
}

export default Checkout;