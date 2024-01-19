import { useState } from "react";
import { URI, dateFns, fetcher } from "~utils";
import { useAuthStore } from "./useAuthStore";
import { useMessageHeader } from "./useMessageHeader";

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
type response = {
  status: number,
  message: string
  data: { [key: string]: string }[]
}

export function useAttendanceList() {
  const { user } = useAuthStore()
  const { setMsg } = useMessageHeader()
  const [attendanceList, setAttendanceList] = useState<attendanceList[]>([])

  async function getAttendanceList(year: number, month: number) {
    const { status, statusText, data } = await fetcher.postForm(URI["attendance list"], {
      user_id: user.id,
      franchise_id: user.franchiseId,
      year,
      month: `${month + 1 < 10 && '0'}${month + 1}`
    })
    // console.log(data)

    const json = data as response

    const error = !(status === 200 ? (json.status == 200 || json.status == 404) : false);
    const message = status < 500 ? json.message : statusText;
    const list = parseAttendanceListJson(json.data)

    // console.log({ list })

    if (error) {
      setMsg({
        id: 'attendance list',
        title: 'attendance list',
        description: message,
        type: 'error',
      })
    }

    setAttendanceList(list)
  }

  return {
    attendanceList,
    getAttendanceList
  }
}


function parseAttendanceListJson(data: { [key: string]: string }[]) {
  let obj = {} as { [key: string]: attendanceList }
  data.forEach(_ => {
    let date = dateFns.parseDate(_['date'], 'date');
    obj[`${date ? date.getTime() : 0}`] = {
      date,
      punchIn: {
        time: dateFns.parseDate(_['time_in'], 'time'),
        pic: _['in_time_pic'] || '',
        location: _['in_time_location'] || '',
        approvalStatus: parseInt(_['in_time_approval_status']) || 0,
      },
      punchOut: {
        time: dateFns.parseDate(_['time_out'], 'time'),
        pic: _['out_time_pic'] || '',
        location: _['out_time_location'] || '',
        approvalStatus: parseInt(_['out_time_approval_status']) || 0,
      }
    }
  });

  return Object.values(obj)
}



// let s = {
//   "date": dateFns.parseDate(_['date'], 'date'),
//   "time_in": dateFns.parseDate(_['time_in'], 'time'),
//   "in_time_pic": _['in_time_pic'] || '',
//   "in_time_location": _['in_time_location'] || '',
//   "in_time_approval_status": parseInt(_['in_time_approval_status']) || 0,
//   "time_out": dateFns.parseDate(_['time_out'], 'time'),
//   "out_time_pic": _['out_time_pic'] || '',
//   "out_time_location": _['out_time_location'] || '',
//   "out_time_approval_status": parseInt(_['out_time_approval_status']) || 0,
// }