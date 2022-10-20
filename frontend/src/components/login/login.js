import React, { useState } from "react";
import './login.css';
import { useNavigate } from "react-router-dom";

import { useCookies } from 'react-cookie';
import axiosInstance from "../../axiosInstance";

// import { isloggedIn } fro/m "../../App";
const Login = (props) => {

    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    // const isLoggedIn=useContext(isloggedIn);
    const navigate = useNavigate();
    const [user, setUser] = useState({
        phoneNumber: "",
        password: ""
    })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleLogin = () => {
        if (user.phoneNumber && user.password) {
            axiosInstance.post("/login", user).then((res) => {
                if(res.data.message!="login sucess")
                {
                    alert(res.data.message);
                    return;
                }
                // console.log(res.data.message)
                const newData={
                    'phoneNumber':res.data.user.phoneNumber,
                    '_id':res.data.user._id
                }
                props.setUser(newData)
                console.log(res.data.token);
                console.log(res);
                setCookie("phoneNumber", res.data.user.phoneNumber, { path: '/' });
                setCookie("token", res.data.token, { path: '/' })
                alert(res.data.message)
                
                navigate("/")
                window.location.reload()
            })

        }
        else {
            alert("first please fill the details")
        }
    }
    return (
        <div>
            <nav className="navbar navbar-light bg-light maxwidth">
                <h1 className="navbar-brand mb-0 h1">Remind Me 🙋‍♂️</h1>
            </nav>
            <div className="App">
            <div className="login">
                <input type="tel" name="phoneNumber" onChange={handleChange} placeholder="phone number" value={user.phoneNumber} />
                <input type="password" name="password" onChange={handleChange} placeholder="password" value={user.password} />
                <div className="button" onClick={handleLogin}>Login</div>
                <h3>OR</h3>
                <div className="button" onClick={() => { navigate("/register") }}>Register</div>
            </div>
            </div>
        </div>
    )
}

export default Login;