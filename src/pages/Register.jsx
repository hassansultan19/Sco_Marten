import { Link } from "react-router-dom";
import "../pages/Register.css";

const Register = () => {
    return (
       <div className="container mx-auto">

<div className="fisrt-reg">
            <div className="inner-wala">
                <div className="left-wala">
                    <div>
                <img style={{width:"120px", height:"60px" , objectFit:"contain"}} src="./assests/logo.png" alt="" />

                    </div>

                    <div className="heading">
                        <h1 style={{fontFamily:"Recoleta-Regular"}}>Dont have an <br /> account?</h1>
                    </div>

                    <div className="text">
                        <p>Register to access all the features of our services.</p>
                        <p>Manage your business in one place. Its free!</p>
                    </div>
                </div>

                <div className="right-wala">
                    <div className="input-wala">
                        <input type="text" placeholder="Name" />
                        <input type="text" placeholder="Last Name" />
                        <input type="password" placeholder="Password" />
                        <input type="password" placeholder="Re-Enter Password" />
                    </div>

                    <div className="check-wala">
                        <input type="checkbox" id="terms" />
                        <label htmlFor="terms">I have read and agree with Terms of Services and our Privacy Policy</label>
                    </div>

                    <div className="sign-up-wala">
                        <button className="all-btn-hover" type="submit">Sign Up</button>
                    </div>

                

                    <div className="already-wala">
                        <Link to="/login">Already have an account?<span style={{color:'red',marginLeft:'2px'}}>Sign in</span></Link>
                    </div>
                </div>
            </div>
        </div>

       </div>
    );
};

export default Register;
