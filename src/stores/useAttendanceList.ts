import { useState } from "react";
import { URI, dateFns, fetcher } from "~utils";
import { useAuthStore } from "./useAuthStore";
import { useMessageHeader } from "./useMessageHeader";
import { AxiosError } from "axios";

/**
 *  {
            "date": "2024-01-16",
            "time_in": "12:46:07",
            "in_time_pic": "user_pic_21_2024-1-16_12:46:7.jpeg",
            "in_time_location": "",
            "in_time_approval_status": "1",
            "time_out": "17:00:00",
            "out_time_pic": "",
            "out_time_location": "Thane, Maharashtra",
            "out_time_approval_status": "1"
        },
 */
export type attendanceList = {
  date: Date | null;
  punchIn: {
    time: Date | null;
    pic: string;
    location: string;
    approvalStatus: number;
  },
  punchOut: {
    time: Date | null;
    pic: string;
    location: string;
    approvalStatus: number;
  },
}
type attendanceListResponse = {
  status: number,
  message: string
  data: { [key: string]: string }[]
}
type attendanceSummaryResponse = {
  status: number,
  message: string
  data: { [key: string]: string }
}

export function useAttendanceList() {
  const { user } = useAuthStore()
  const { setMsg } = useMessageHeader()
  const [attendanceList, setAttendanceList] = useState<attendanceList[]>([])

  async function getAttendanceList(year: number, month: number) {

    let error = false;
    let message = 'success'
    let list = parseAttendanceListJson([])

    await fetcher.postForm(URI["attendance list"], {
      user_id: user.id,
      franchise_id: user.franchiseId,
      year,
      month: `${month + 1 < 10 ? '0' : ''}${month + 1}`
    })
      .then(({ status, statusText, data }) => {
        const json = data as attendanceListResponse
        error = !(status === 200 ? (json.status == 200 || json.status == 404) : false);
        message = status < 500 ? json.message : statusText;
        list = parseAttendanceListJson(json.data)
      })
      .catch(e => {
        error = true
        message = (e as AxiosError).message
      })
      .finally(() => {
        if (error) {
          setMsg({
            id: 'attendance list',
            title: 'attendance list',
            description: message,
            type: 'error',
          })
        }

        setAttendanceList(list)
      })
  }

  const [attendanceSummary, setAttendanceSummary] = useState<{ [key: number]: number }>({})
  async function getAttendanceSummary(year: number, month: number) {

    let error = false;
    let message = 'success'
    let summary = {}

    await fetcher.postForm(URI["attendance summary"], {
      user_id: user.id,
      franchise_id: user.franchiseId,
      year,
      month: `${(month + 1) < 10 && '0'}${month + 1}`
    })
      .then(({ status, statusText, data }) => {
        const json = data as attendanceSummaryResponse
        error = !(status === 200 ? (json.status == 200 || json.status == 404) : false);
        message = status < 500 ? json.message : statusText;
        summary = parseAttendanceSummaryJson(json.data)
      })
      .catch(e => {
        error = true;
        message = (e as AxiosError).message
      })
      .finally(() => {
        if (error) {
          setMsg({
            id: 'attendance list',
            title: 'attendance list',
            description: message,
            type: 'error',
          })
        }
        // console.log(summary)
        setAttendanceSummary(summary)
      })
  }

  return {
    attendanceList,
    getAttendanceList,
    attendanceSummary,
    getAttendanceSummary
  }
}


function parseAttendanceListJson(data: { [key: string]: string }[]) {
  let obj = {} as { [key: string]: attendanceList }
  data.forEach(_ => {
    let date = dateFns.parseDate(_['attendance_date'], 'date');
    obj[`${date ? date.getTime() : 0}`] = {
      date,
      punchIn: {
        time: dateFns.parseDate(_['in_time'], 'time'),
        pic: _['in_time_pic'] || '',
        location: _['in_time_location'] || '',
        approvalStatus: parseInt(_['in_time_approval_status']) || 0,
      },
      punchOut: {
        time: dateFns.parseDate(_['out_time'], 'time'),
        pic: _['out_time_pic'] || '',
        location: _['out_time_location'] || '',
        approvalStatus: parseInt(_['out_time_approval_status']) || 0,
      }
    }
  });
  return Object.values(obj)
}

function parseAttendanceSummaryJson(data: { [key: string]: string }) {
  let object = {} as { [key: number]: number }
  for (let key in data) {
    object[parseInt(key) || 0] = parseInt(data[key]) || 0
  }
  return object
}