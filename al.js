
const fast2sms =require("fast-two-sms")
const axios=require("axios");

const my_data = {
 'sender_id': 'FSTSMS',
 'message': 'This is a test message', 
 
 'language': 'english',
 'route': 'p',
 'numbers': '9938588108'   
}

const headers = {
  'authorization': 'AA8z6gn4La32V0PXNPipqvRKShkq8IwJZe35i41z3SQTS2QgVhZGt4Fh7d5z',
}

function sendMessage() {
  var options = {
    authorization:
      "AA8z6gn4La32V0PXNPipqvRKShkq8IwJZe35i41z3SQTS2QgVhZGt4Fh7d5z",
    message:"EEEEEEEEEEEee",
    numbers: ["9938588108","993858810"],
  };

  // send this message

  fast2sms
    .sendMessage(options)
    .then((response) => {
      console.log("SMS OTP Code Sent Successfully")
      console.log(response);
    })
    .catch((error) => {
      console.log("Some error taken place")
    });
}
sendMessage()