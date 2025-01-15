import './Booking.css';
import Flower from './Flower';

const Booking = () => {
  return (
    <div className="booking-container">
      <h1 style={{ fontFamily: "Recoleta-Regular" }}>Book Your Service</h1>
      <div className="bookimg">
            <img src="./assests/booking.webp" alt="" />
        </div>
      <div className="booking-content">
      
        {/* Left-side image */}
        <Flower />

        {/* Right-side form */}
        <div className="booking-form">
          <h2 style={{ fontFamily: "Recoleta-Regular" }}>Reservation Form</h2>
          <form>
            <div className="form-row">
              <div className="input-container">
                <input type="text" required />
                <label>Full Name</label>
              </div>
              <div className="input-container">
                <input type="text" required />
                <label>Last Name</label>
              </div>
            </div>
            <div className="form-row">
              <div className="input-container">
                <input type="number" />
                <label>Contact Number</label>
              </div>
              <div className="input-container">
                <input type="email" />
                <label>Email Address</label>
              </div>
              
            </div>


            <div className="form-row">
              <div className="input-container">
                <input type="text" />
                <label>Address</label>
              </div>
              <div className="input-container">
                <input type="tel" />
                <label>Street Address</label>
              </div>
              
            </div>

            <div className="form-row">
              <div className="input-container">
                <input type="text" />
                <label>Country</label>
              </div>
              <div className="input-container">
                <input type="tel" />
                <label>City</label>
              </div>
              
            </div>

            <div className="form-row">
              <div className="input-container">
                <input type="text" />
                <label>Postal Code</label>
              </div>
              <div className="input-container">
                <input type="tel" />
                <label>Your Age</label>
              </div>
              
            </div>


            
            <div className="form-row">
              <div className="input-container">
                <textarea rows="6"></textarea>
                <label>Additional Details</label>
              </div>
            </div>
            <button style={{ backgroundColor: "#990000", width: "100%" }} type="submit" className="submit-btn">
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
