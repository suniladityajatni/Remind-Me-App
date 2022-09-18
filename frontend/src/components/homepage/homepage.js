// import { useState } from 'react';
import React, { useEffect, useState } from 'react';
import './homepage.css';
import axios from 'axios';
import DateTimePicker from 'react-datetime-picker';
import { useNavigate } from 'react-router-dom';

import { useCookies } from 'react-cookie';
import Navbar from '../Navbar/navbar';
import axiosInstance from '../../axiosInstance';
// import { Navigate } from 'react-router-dom';

function Homepage(props) {

  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  
  const navigate = useNavigate();
  const [reminderMssg, setReminderMssg] = useState("");
  const [remindTime, setRemindTime] = useState(new Date());
  const [allRemiders, setAllReminders] = useState([])

  useEffect(() => {
    // const phoneNumber = props.user.phoneNumber
    const token=cookies.token
    // console.log("phoneNumber = "+phoneNumber);
    axiosInstance.post("/getAllReminder", { token }).then(
      (res) => {

        console.log(res.data)
        setAllReminders(res.data)
      }
    )
  }, [])

  const addReminder = () => {
    // console.log("Done frm react")
    const ReminderMessage = reminderMssg
    const RemindAt = remindTime
    const phoneNumber = props.user.phoneNumber
    axiosInstance.post("/addReminder", { ReminderMessage, RemindAt, phoneNumber }).then(
      (res) => {
        console.log(res.data)
        setAllReminders(res.data)
      }
    )

    setReminderMssg("");
    setRemindTime(new Date());
  }

  const deletRemider = (_id) => {
    const id = _id;
    const phoneNumber = props.user.phoneNumber
    axiosInstance.post("/deletRemider", { id, phoneNumber }).then((res) => { setAllReminders(res.data) })
  }
  const handleChange = (e) => {
    setReminderMssg(e.target.value);
  }

  

  return (
    <div className="App">
    {/* <> */}
    <div className='homepage'>
    <Navbar setUser={props.setUser}/>
      {/* <div className='button alignLeft' onClick={logout}>
        <h4 className='logout'>LogOut</h4>
      </div> */}
      <div className='homepage_header'>
        <h1>Remind Me 🙋‍♂️</h1>
        <input type="text" onChange={handleChange} value={reminderMssg} />
        <DateTimePicker
          minDate={new Date()}
          minutePlaceholder="mm"
          hourPlaceholder="hh"
          dayPlaceholder="DD"
          monthPlaceholder="MM"
          yearPlaceholder="YYYY"
          className="react-datetime-picker"
          onChange={setRemindTime}
          value={remindTime} />
        <div className='button' onClick={addReminder}>Add Reminder</div>
      </div>
      <div className='homepage_body'>

        {
          allRemiders.map((r) => { 
            if(r.isReminded===false)
            {
            return(
            <div key={r._id} className='reminder_card'>
              <h2>{r.ReminderMessage}</h2>
              <h3>Remind Me at:</h3>
              <p>{String(new Date(r.RemindAt.toLocaleString(undefined, { timezone: "Asia/Kolkata" })))}</p>
              <div className='button' onClick={() => deletRemider(r._id)}>Delete</div>
            </div>
          )}
        })
        }

      </div>
    </div>
    </div>
  );
}

export default Homepage;
