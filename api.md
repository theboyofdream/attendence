
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


//////////////////

{
  
}

"pk_attendance_intime_id": "2",
"fk_franchise_id": "8",
"fk_user_id": "21",
"date": "2024-01-17",
"time_in": "11:25:12",
"hours_worked": "4.5666666666667",
"face_capture_pic": "",
"location": "Thane, Maharashtra",
"latitude": "39.12345",
"longitude": "72.12345",
"status": "present",
"remarks": null,
"created_date": "2024-01-17 15:03:16",

"pk_attendance_outtime_id": "1",
"time_out": "17:00:00",
"pk_user_id": "21",
"fk_franchise_master": "0",
"user_firstname": "Inamulla",
"user_middlename": null,
"user_lastname": "Shaikh ",
"user_gender": "male",
"user_password": "$2y$10$dDpDBZg15HsksHcaFO9oUus/Oex/FpRefR5sai8WlySwwnY.CGtti",
"user_email": "inam@dhwajpartner.com",
"user_mob": "8369943019",
"user_dob": null,
"city": "Thane",
"state_id": "12",
"pincode": "400601",
"user_head": "5",
"user_pic": "user_pic/1699602310_a393140ea39eb9820266.jpg",
"fk_role_id": "5",
"schedule_id": "1",
"department_id": "0",
"salary": null,
"date_of_joining": "03-08-2023",
"in_time": "00:00:00",
"out_time": "00:00:00",
"week_off_day": "Monday",
"fk_project_id": "0",
"session_id": null,
"user_create_date": "2023-10-26 08:53:51",
"created_by": "1",
"updated_by": null,
"is_delete": "1",
"is_active": "1"