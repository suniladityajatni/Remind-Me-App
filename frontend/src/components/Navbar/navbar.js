import React, { useState } from "react";
import './navbar.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useCookies } from 'react-cookie';

// import { isloggedIn } fro/m "../../App";
const Navbar = (props) => {
    

  const [cookies, setCookie, removeCookie] = useCookies(['user']);

    
  const navigate = useNavigate();
    const logout = () => {
        props.setUser({})
        removeCookie("_id");
        removeCookie("phoneNumber");
        removeCookie('token');
        // removeCookie("password");
        navigate("/login")
      }
    return (
        // <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light extend">
                <a className="navbar-brand" href="/">🙋‍♂️</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/prevReminder">Previous Reminders</a>
                        </li>

                    </ul>
                    <form className="form-inline my-2 my-lg-0 alignLeft">
                            <button className="btn btn-outline-success my-2 my-sm-0 " type="button" onClick={logout}>LogOut</button>
                    </form>
                </div>
            </nav>
        // </div>
    )
}

export default Navbar;