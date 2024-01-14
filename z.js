let login = {
  "error": "0",
  "message": "success",
  "attendence-list": [
    {
      "user_id": "24",
      "fk_franchise_id": "8",
      "user_firstname": "Ruksar",
      "user_lastname": "Shaikh",
      "user_email": "ruksar@dhwajpartner.com",
      "user_mob": "8691883042",
      "fk_role_id": "4",
      "fk_project_id": "0",
      "user_pic": "https://sahikarma.com/writable/uploads/user_pic/1699602106_74a1bd2781c7a4587fa7.jpg",
      "staff_logged_in": "1"
    }
  ]
}

login = {
  "status": "0", // 200, 400, 404, 500
  "message": "success",
  "data": {
    "id": "24",
    franchiseID: 0,
    "firstname": "Ruksar",
    "lastname": "Shaikh",
    "email": "ruksar@dhwajpartner.com",
    "picture": "https://sahikarma.com/writable/uploads/user_pic/1699602106_74a1bd2781c7a4587fa7.jpg",
    dateOfJoining: '',
    inTime: '',
    outTime: ''
  }
}


let intime = {
  "error": false,
  "message": "Time in: Ruksar Shaikh"
}

request = {
  franchise_id: 8,
  user_id: 24,
  date: '2023-11-02',
  time_in: '17:00:00',
  face_capture_pic: test.png,
  location: 'Thane, Maharashtra',
  latitude: 39.12345,
  longitude: 72.12345,
  status: present
}

intime = {
  "status": 200,
  "message": "success",
  "data": "Marked In Time: Ruksar Shaikh"
}

let outtime = { "error": false, "message": "Time out: Jai Yadav" }
outtime = {
  "status": 200,
  "message": "success",
  "data": "Marked Out time: Jai Yadav"
}
requset = {
  id: 24,
  franchiseID: 8,
  date: '2023-11-02',
  time: '17:00:00',
  picture: test.png,
  location: 'Thane, Maharashtra',
  latitude: 39.12345,
  longitude: 72.12345,
}


https://sahikarma.com/api/attendence/login
https://sahikarma.com/api/attendence/intime
https://sahikarma.com/api/attendence/outtime
https://sahikarma.com/api/attendence/approval-status