import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link, TextField, Card, Button } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { otpVerification, sendOTP } from "../services/userAPI";
import logo from "../../assets/images/Wavy_Tech-17_Single-03.jpg";
import {
    otpButtonStyle, otpErrorStyle,
    otpFieldStyle,
    otpVerifiedIconStyle,
    resendOTPStyle
} from "../OtpVerification/OtpVerification.Styles";
import "./OtpVerification.Styles.scss"

//OTP Verification Component
export default function OtpVerificationCard() {

    let { state } = useLocation();

    console.log(state);
    const [email,] = useState(state.email);
    const [OTP, setOTP] = useState("");
    const [otpSecret, setOtpSecret] = useState(state.otpSecret);
    const [otpMisMatchError, setOtpMisMatchError] = useState(null);
    const [isValidOTP, setIsValidOTP] = useState(true);
    const [isOTPVerified, setIsOTPVerified] = useState(false);

    const [minutes, setMinutes] = useState(2);
    const [seconds, setSeconds] = useState(0);

    const navigate = useNavigate();

    //Function Start OTP timer everytime the Component Renders
    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);
                } else {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [seconds, minutes]);

    //Function to Handle Resend OTP onClick
    const handleResendOTP = (e) => {
        e.preventDefault();
        setOtpMisMatchError(null);
        setOTP("");
        const form_data = new FormData();

        form_data.append('email', email);

        //API call to Resend OTP
        sendOTP(form_data).then(res => {
            setOtpSecret(res.data.otpSecret);
            setIsValidOTP(true);
            setMinutes(2);
            setSeconds(0);

            console.log(res);
        })
            .catch(err => {
                //Handling Error from API
                if (err.response.status === 400 || err.response.status === 500) {
                    setOtpMisMatchError("Error with server");
                }
                console.log(err.response.data);
            });
    };

    //Function to handle OTP Verification onSubmit
    const handleVerification = (e) => {
        e.preventDefault();
        const form_data = new FormData();
        console.log(email);
        form_data.append('email', email);
        form_data.append('otpSecret', otpSecret);
        form_data.append('otp', OTP);
        console.log(form_data);

        //Making API Call to Verify OTP
        otpVerification(form_data)
            .then(res => {
                if (res.status === 201) {
                    setIsOTPVerified(true);
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000)
                } else {
                    console.log("Invalid OTP");
                };
            })
            .catch(err => {
                //Handling Error from APi call
                if (err.response.status === 401) {
                    setIsValidOTP(false);
                    setOtpMisMatchError("Invalid OTP");
                }
                console.log(err.response.data);
            });


    };

    //Function to Handle OTP value onChange
    const handleOTPOnChange = event => {
        setIsValidOTP(true);
        setOTP(event.target.value);
        setOtpMisMatchError(null);

    }

    return (
        <div>
            <div className="sign-up-Image-container">
                <img className="signUp-Image" src={logo} alt="OTP verification" />
            </div>
            <div className="signup-form-container">

                <Card sx={{ boxShadow: 7, borderRadius: 3 }} className="otpVerification-card">
                    {

                        isOTPVerified ? (
                            <>
                                <CheckCircleOutlineRoundedIcon sx={otpVerifiedIconStyle}></CheckCircleOutlineRoundedIcon>
                                <h2 className="otpVerifiedText">OTP Verified </h2>
                            </>
                        ) : (
                            <>
                                <h1 className="otpVerification-heading">OTP Verification</h1>
                                <div className="otpField">
                                    <TextField style={otpFieldStyle}
                                        color="secondary"
                                        id="outlined-password-input"
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={OTP}
                                        onChange={handleOTPOnChange}
                                        required
                                        error={!isValidOTP}
                                    />
                                    {<h5 style={otpErrorStyle}>{otpMisMatchError}</h5>}
                                </div>
                                <div className="countdown-text">
                                    {seconds > 0 || minutes > 0 ? (
                                        <p className="counter">
                                            Time Remaining: <span className="time">{minutes < 10 ? `0${minutes}` : minutes}:
                                                {seconds < 10 ? `0${seconds}` : seconds}</span>
                                        </p>
                                    ) : (
                                        <p className="otp-NotRecieved-text">Didn't recieve code? <Link className="resend-otp" style={resendOTPStyle} onClick={handleResendOTP}>Resend OTP</Link></p>
                                    )}
                                </div>
                                <div className="otpSubmitButton">
                                    <Button style={otpButtonStyle} type="submit" variant="contained" onClick={handleVerification}>submit</Button>
                                </div>
                            </>)
                    }
                </Card>
            </div>
        </div>
    )

}