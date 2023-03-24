import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import { Card, Button, TextField, Tooltip, Zoom } from '@mui/material';
import { UserContext } from "../../contexts/UserContext";
import { updateUserDetails } from "../services/userAPI";
import { editButtonStyle, cancelButtonStyle, saveButtonStyle } from './UserProfile.style';
import './UserProfile.styles.scss';
import logo from "../../assets/images/user.jpg";

//User Profile Component
const UserProfile = () => {

    const { user, setUser } = useContext(UserContext);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isEditDisabled, setIsEditDisabled] = useState(true);
    const [isEditButtonDisabled, setIsEditButtonDisabled] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [tempUserName, setTempUserName] = useState("");
    const [tempPassword, setTempPassword] = useState("");
    const [isToolTipOpen, setIsToolTipOpen] = useState(false);
    const passwordRequirementText = "Password requires atleast one number, Uppercase, Lowercase, special Character with a min of 8 characters";

    //Function to Handle Edit button onClick
    const handleEdit = (e) => {
        e.preventDefault();
        setTempUserName(userName);
        setTempPassword(password);
        setIsEditButtonDisabled(!isEditButtonDisabled);
        setIsEditDisabled(!isEditDisabled);
    }

    //Function to Handle Cancel Button onClick
    const handleCancelEdit = (e) => {
        e.preventDefault();
        setUserName(tempUserName);
        setPassword(tempPassword);
        setIsEditButtonDisabled(!isEditButtonDisabled);
        setIsEditDisabled(!isEditDisabled);
    }

    //Function to handle Save Button onSubmit
    const handleUpdateUserDetails = (e) => {
        console.log(user.email);
        e.preventDefault();

        //Validation before making API Call
        if (!isValidPassword || !isValidUsername) {
            return;
        }

        const form_data = new FormData();
        const userId = user.id;
        form_data.append('userName', userName);
        form_data.append('password', password);

        //Making API call for Updating User details
        updateUserDetails(userId, user.token, form_data)
            .then(res => {
                console.log("res: ", res);
                setUser(res.data);
                setUserName(res.data.userName);
                setPassword("");

            }).catch(err => {
                //Handling error from API Call
                if (err.response.status === 400 || err.response.status === 500) {
                    console.log("Something Wrong with Server");
                }
                console.log(err.response.data);
            });

        setIsEditButtonDisabled(!isEditButtonDisabled);
        setIsEditDisabled(!isEditDisabled);

    };

    //Function to Validate Username using Regex
    const validateUserName = (username) => {
        const regex = /^[a-zA-Z ]{2,40}$/;
        return regex.test(username);
    };

    //Function to Validate Password using Regex
    const validatePassword = (password) => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.@*\s).{8,15}$/;
        return regex.test(password);
    };

    //Function to Handle UserName onChange
    const handleUserNameOnChange = event => {
        if (!validateUserName(event.target.value)) {
            setIsValidUsername(false)
        } else {
            setIsValidUsername(true);
        };
        setUserName(event.target.value);
    };

    //Function to Handle to Password onChange
    const handlePasswordOnChange = event => {
        if (!validatePassword(event.target.value)) {
            setIsValidPassword(false);
            setIsToolTipOpen(true);
        } else {
            setIsValidPassword(true);
            setIsToolTipOpen(false);
        };
        setPassword(event.target.value);
    };

    //Function to set UserName Initially
    useEffect(() => {
        console.log(user);
        setUserName(user.userName);
    }, []);

    return (
        <div>
            <div className="user-profile-Image-container">
                <img className="user-profile-Image" src={logo} alt="User Profile" />
            </div>
            <div className="userProfile-container">
                <Card sx={{ boxShadow: 3, borderRadius: 3 }} className="userProfile-card">
                    <h1 className="userprofile-heading">User Profile</h1>
                    <div className="userForm">
                        {
                            <form className="userProfileForm" onSubmit={handleUpdateUserDetails}>
                                <div className="profileFormElements">
                                    <div className="name-textField"><h3 className="name">Username</h3></div>
                                    <div className="nameField">
                                        <TextField disabled={isEditDisabled}
                                            id="outlined-password-input"
                                            type="text"
                                            placeholder="Name"
                                            value={userName}
                                            onChange={handleUserNameOnChange}
                                            required
                                            error={!isValidUsername}
                                        />
                                    </div>
                                </div>
                                <div className="profileFormElements">
                                    <div className="textField"><h3 className="password">Password</h3></div>
                                    <div className="passwordField">
                                        <Tooltip TransitionComponent={Zoom} open={isToolTipOpen} title={passwordRequirementText} TransitionProps={{ timeout: 500 }} placement="right" arrow>
                                            <TextField disabled={isEditDisabled} onMouseEnter={() => setIsToolTipOpen(true)} onMouseLeave={() => setIsToolTipOpen(false)}
                                                id="outlined-password-input"
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={handlePasswordOnChange}
                                                required
                                                error={!isValidPassword}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>

                                {!isEditButtonDisabled ? (
                                    <div className="edit-button">
                                        <Button style={editButtonStyle} type="submit" variant="contained" onClick={handleEdit}>Edit</Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="options-container">
                                            <div className="save-button">
                                                <Button style={saveButtonStyle} type="submit" variant="contained">save</Button>
                                            </div>
                                            <div className="cancel-button">
                                                <Button style={cancelButtonStyle} type="submit" variant="contained" onClick={handleCancelEdit}>cancel</Button>
                                            </div>
                                        </div>
                                    </>
                                )
                                }
                            </form>
                        }

                    </div>

                </Card>
            </div>
        </div>
    );
}


export default UserProfile;