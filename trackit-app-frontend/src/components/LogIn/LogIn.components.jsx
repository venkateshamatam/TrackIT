import * as React from 'react';
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, TextField, Button } from '@mui/material';
import { loginButtonStyle } from "./LogIn.styles";
import logo from '../../assets/images/Project-Management.jpg';
import { UserContext } from "../../contexts/UserContext";
import { loginUser } from "../services/userAPI";
import { loginField } from "./LogIn.styles";
import './LogIn.styles.scss';

//Login Component
export default function LoginCard() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [credentialsError, setCredentialsError] = useState(null);

    //Function to handle login functionality onSubmit
    const handleLogIn = (e) => {
        e.preventDefault();

        const form_data = new FormData();
        form_data.append('email', email);
        form_data.append('password', password);

        //Making API call to Backend for Validating credentials
        loginUser(form_data).then(res => {
            console.log(res.data);

            //Setting Response data to Context variable for further Use
            setUser(res.data);

            if (res.status === 200) {
                navigate("/home");
            } else {
                console.log("Invalid credentials");
            };
        }).catch(err => {
            //Handling Errors thrown by API
            if (err.response.status === 400 || err.response.status === 401) {
                setCredentialsError("Invalid Credentials");
                setIsValidEmail(false);
                setIsValidPassword(false);
            }
            console.log("err: ", err);
            console.log(err.response.data);
        });

    };

    //Validating Email using regex
    const validateEmail = (email) => {
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return regex.test(email);
    };

    //Function to handle email value OnChange
    const handleEmailOnChange = event => {
        if (!validateEmail(event.target.value)) {
            setIsValidEmail(false)
        } else {
            setIsValidEmail(true);
        };
        setEmail(event.target.value);
    };

    //Function handle password value OnChange
    const handlePasswordOnChange = event => {
        setIsValidPassword(true);
        setPassword(event.target.value);
        setCredentialsError(null);
    };

    return (

        <div>
            <div className="login-Image-container">
                <img className="login-Image" src={logo} alt="Login" />
            </div>

            <div className="login-form-container">
                <Card sx={{ boxShadow: 5, borderRadius: 4 }} className="login-card">
                    <h1 className="login-heading">Login</h1>
                    <form className="loginForm" onSubmit={handleLogIn}>

                        <div className="loginFormElements">
                            <TextField style={loginField}
                                id="password-input"
                                label="Email"
                                type="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={handleEmailOnChange}
                                required
                                error={!isValidEmail}
                            />
                        </div>

                        <div className="loginFormElements">
                            <TextField style={loginField}
                                id="outlined-password-input"
                                label="Password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordOnChange}
                                required
                                error={!isValidPassword}
                            />
                        </div>

                        {<h5 className="error-text">{credentialsError}</h5>}

                        <Button style={loginButtonStyle} type="submit" variant="contained">Log In</Button>
                        <p> New User?  <a className="loginToSignup" href="/signup">Sign Up</a></p>

                    </form>
                </Card>
            </div>
        </div>
    );
}
