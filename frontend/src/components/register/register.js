import React, { useState } from "react";
import './register.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {

    const url = "https://remind-meapp.herokuapp.com";
    // const url="http://localhost:9000";
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        phoneNumber: "",
        password: "",
        reEnterPassword: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleRegister = () => {
        if (user.name && user.phoneNumber && user.password && (user.password === user.reEnterPassword)) {
            axios.post(url + "/register", user).then((res) => {
                alert(res.data.message);
            })
            navigate("/login");
        }
        else {
            alert("Invalid Input");
        }
    }
    return (
        <div>
            <nav className="navbar navbar-light bg-light maxwidth">
                <h1 className="navbar-brand mb-0 h1">Remind Me 🙋‍♂️</h1>
            </nav>
            <div className="App">
        <div className="register">
            <input type="text" name="name" placeholder="name" value={user.name} onChange={handleChange} />
            <input type="tel" name="phoneNumber" placeholder="phone Number" value={user.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="password" value={user.password} onChange={handleChange} />
            <input type="password" name="reEnterPassword" placeholder="re enter password" value={user.reEnterPassword} onChange={handleChange} />
            <div className="button" onClick={handleRegister}>Register</div>
            <h3>OR</h3>
            <div className="button" onClick={() => navigate("/login")}>Login</div>
        </div>
        </div>
        </div>
    )
}

export default Register;