
Login
https://sahikarma.com/attendence-login
 email: jai@gmail.com,   password: 123456
 {"error":"0","message":"success","attendence-list":[{"user_id":"1","fk_franchise_id":"0","user_firstname":"Jaip","user_lastname":"Yadav","user_email":"jai@gmail.com","user_mob":"8523697410","fk_role_id":"1","fk_project_id":"0","user_pic":"https:\/\/sahikarma.com\/user_pic\/1696670187_63e19e8198a2f6300eeb.jpeg","staff_logged_in":"1"}]}


https://sahikarma.com/marked-attendance-intime
franchise_id:8
user_id:9
date:2023-11-02
time_in:17:00:00
face_capture_pic:test.png
location:Thane, Mh
latitude:39.12345
longitude:72.12345
status:present
{"error":1,"message":"Time in: Jai Yadav"}
{"error":true,"message":"You have logged in for today"}


https://sahikarma.com/marked-attendance-outtime
franchise_id:8
user_id:9
Response Json data: {"error":false,"message":"Time out: Jai Yadav"}
Error Response : {"error":true,"message":"You have timed out for today"}


**attendance-list**
request
  params: {
    user_id,
    franchise_id,
    year,
    month,
  }

response for success
{
  status
  message
  data: [{
    date,
    in_time,
    in_time_pic,
    in_time_location,
    in_time_approval_status,
    out_time,
    out_time_pic,
    out_time_location,
    out_time_approval_status,
  }]
}

{
  status
  message
  data: [{
    date
    in_time:{
      time,
      pic,
      location,
      approval_status
    },
    out_time:{
      time,
      pic,
      location,
      approval_status
    }
  }]
}

response for error
{
  status
  message
  data: []
}