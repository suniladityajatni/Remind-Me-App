// import { useState } from 'react';
import React, { useEffect, useState } from 'react';
import './previReminder.css';


import { useCookies } from 'react-cookie';
import Navbar from '../Navbar/navbar';
import axiosInstance from '../../axiosInstance';

function PreviousReminder(props) {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
 
  const [allRemiders, setAllReminders] = useState([])

  useEffect(() => {
    const token=cookies.token
    axiosInstance.post("/getAllReminder", { token }).then(
      (res) => {
        console.log(res.data)
        setAllReminders(res.data)
      }
    )
  }, [])

  const deletRemider = (_id) => {
    const id = _id;
    const phoneNumber = props.user.phoneNumber
    axiosInstance.post("/deletRemider", { id, phoneNumber }).then((res) => { setAllReminders(res.data) })
  }
  return (
    <div className="App">
      <div className='homepage'>
        <Navbar setUser={props.setUser} />

        <div className='homepage_body'>

          {
            allRemiders.map((r) => {
              if (r.isReminded === true) {
                return <div key={r._id} className='reminder_card'>
                  <h2>{r.ReminderMessage}</h2>
                  <h3>Remind Me at:</h3>
                  <p>{String(new Date(r.RemindAt.toLocaleString(undefined, { timezone: "Asia/Kolkata" })))}</p>
                  <div className='button' onClick={() => deletRemider(r._id)}>Delete</div>
                </div>

              }
            })
          }

        </div>
      </div>
    </div>
  );
}

export default PreviousReminder;
