// import { useState } from 'react';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useCookies } from 'react-cookie';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
// import {  useState } from 'react';
import Homepage from './components/homepage/homepage';
import Login from './components/login/login';
import Register from './components/register/register';
import PreviousReminder from './components/PreviousReminders/previousReminder';
import axiosInstance from './axiosInstance';
function App() {
  
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const [user, setUser] = useState({'_id':false,'phoneNumber':false,'password':false});

  useEffect(() => {
    // if (cookies.phoneNumber && cookies.password) {
      if(cookies.token)
      {


        axiosInstance.post("/getUser", {'token':cookies.token}).then((res) => {
          console.log("I m here");
          console.log(res.data.user);
          setUser({
              '_id': res.data.user._id,
              'phoneNumber': res.data.user.phoneNumber,
              // 'password': cookies.password
            })
        })
        // setUser({
        //   '_id': cookies._id,
        //   'phoneNumber': cookies.phoneNumber,
        //   // 'password': cookies.password
        // })
      }
    // }
  }, [])

  return (
    <div >
      <Router>
        <Routes>
          <Route exact path="/" element={

            cookies.token ? <Homepage user={user} setUser={setUser} /> : <Login setUser={setUser} />

          } />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/prevReminder" element={cookies.token ? <PreviousReminder user={user} setUser={setUser} /> : <Login setUser={setUser} />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
