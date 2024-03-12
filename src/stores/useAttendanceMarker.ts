import { useEffect } from "react"
import { useMMKVStorage } from "react-native-mmkv-storage"
import fs from 'react-native-fs';
import { storage, useAuthStore, useMessageHeader } from "~stores"
import { URI, dateFns, fetcher } from "~utils"
import { AxiosError } from "axios";

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
    const base64Image = await fs.readFile(params.imageUri, 'base64')

    let postBody: { [key: string]: any } = {
      franchise_id: user.franchiseId,
      user_id: user.id,
      date: dateFns.stringifyDate(params.datetime, 'date'),
      face_capture_pic: base64Image,
      location: params.location.address,
      latitude: params.location.latitude,
      longitude: params.location.longitude,
      status: '2'
    }

    if (type === 'in time') {
      postBody['time_in'] = dateFns.stringifyDate(params.datetime, 'time')
    } else {
      postBody['time_out'] = dateFns.stringifyDate(params.datetime, 'time')
    }

    // console.log(postBody)
    let error = false;
    let message = 'success';

    await fetcher.postForm(uri, postBody, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(({ status, statusText, data }) => {
        const json = data as response;

        error = !(status === 200 ? json.status == 200 : false);
        message = status === 200 ? json.status == 200 ? json.data : json.message : statusText;
      })
      .catch(e => {
        error = true;
        message = (e as AxiosError).message
      })
      .finally(() => {
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
      })
    return !error
  }

  return {
    attendanceMarkedStatus,
    setAttendanceMarkedStatus,
    markAttendance
  }
}