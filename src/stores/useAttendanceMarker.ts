import { useEffect } from "react"
import { useMMKVStorage } from "react-native-mmkv-storage"
import fs from 'react-native-fs';
import { storage, useAuthStore, useMessageHeader } from "~stores"
import { URI, dateFns, fetcher } from "~utils"

export type markAttendanceParams = {
  location: {
    address: string,
    latitude: number,
    longitude: number
  },
  imageUri: string,
  datetime: Date
}
type response = {
  status: number,
  message: string
  data: string,
}

export function useAttendanceMarker() {
  const { user } = useAuthStore()
  const { setMsg } = useMessageHeader();
  const [attendanceMarkedStatus, setAttendanceMarkedStatus] = useMMKVStorage('attendance status', storage, { inTimeMarked: false, outTimeMarked: false, lastModified: new Date() })

  useEffect(() => {
    if (new Date(attendanceMarkedStatus.lastModified).getDate() != new Date().getDate()) {
      setAttendanceMarkedStatus({
        inTimeMarked: false,
        outTimeMarked: false,
        lastModified: new Date()
      })
    }
  }, [])

  async function markAttendance(params: markAttendanceParams, type: 'in time' | 'out time') {
    const uri = type === 'in time' ? URI['punch in'] : URI['punch out']
    const image = await fs.readFile(params.imageUri, 'base64')
    const { status, statusText, data } = await fetcher.postForm(uri, {
      franchise_id: user.franchiseId,
      user_id: user.id,
      date: dateFns.stringifyDate(params.datetime, 'date'),
      time_in: dateFns.stringifyDate(params.datetime, 'time'),
      face_capture_pic: image,
      location: params.location.address,
      latitude: params.location.latitude,
      longitude: params.location.longitude,
      status: 'present'
    }, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const json = data as response;

    const error = !(status === 200 ? json.status == 200 : false);
    const message = status < 500 ? json.message : statusText;
    const response = json.data

    console.log({ status, statusText, data, json, error })

    if (!error) {
      const o = type === 'in time' ? { inTimeMarked: true } : { outTimeMarked: true }
      setAttendanceMarkedStatus((p) => ({
        ...p,
        ...o,
        lastModified: new Date()
      }))
    }

    setMsg({
      id: type,
      title: type,
      description: message,
      type: `${error ? 'error' : 'normal'}`,
    })

    return !error
  }

  return {
    attendanceMarkedStatus,
    markAttendance
  }
}


async function base64File(url: string) {
  const data = await fetch(url);
  const blob = await data.blob();
  const reader = new FileReader();
  let base64Data: string | ArrayBuffer = ''
  reader.readAsDataURL(blob);
  reader.onloadend = () => {
    base64Data = reader.result;
  };
  return base64Data;
}

/**
franchise_id:8
user_id:24
date:2023-11-02
time_in:17:00:00
location:Thane, Maharashtra
latitude:39.12345
longitude:72.12345
status:present
 */