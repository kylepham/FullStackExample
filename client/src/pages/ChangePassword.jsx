import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const changePassword = () => {
        axios.put(`http://localhost:5000/auth/changepassword`, {
            oldPassword, newPassword
        }, {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        }).then((response) => {
            if (response.data.error)
                alert(response.data.error)
        })
    }
    return (
        <div>
            <h1>Change Your Password</h1>
            <input
                type="text"
                placeholder="Old Password..."
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
                type="text"
                placeholder="New Password..."
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={changePassword}>Save Change</button>
        </div>
    );
}

export default ChangePassword;
