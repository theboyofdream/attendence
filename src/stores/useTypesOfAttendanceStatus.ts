import { AxiosError } from "axios";
import { useState } from "react";
import { useAuthStore, useMessageHeader } from "~stores";
import { URI, fetcher } from "~utils";

type response = {
  status: number;
  message: string;
  data: { [key: string]: string }[]
}
export type statusTypes = {
  id: number;
  name: string;
  description: string;
  color: string;
}


export function useTypesOfAttendanceStatus() {
  const { user } = useAuthStore()
  const { setMsg } = useMessageHeader()
  const [statusTypes, setStatusTypes] = useState<statusTypes[]>([])

  async function refreshStatusTypes() {
    let error = false;
    let message = 'success'
    let _statusTypes_ = [] as statusTypes[]

    await fetcher.postForm(URI["types of attendance status"], { user_id: user.id, franchise_id: user.franchiseId })
      .then(({ status, statusText, data }) => {
        const json = data as response;
        error = !(status === 200 ? json.status == 200 : false);
        message = status === 200 ? json.message : statusText;
        if (!error) {
          _statusTypes_ = parseStatusTypeJson(json.data);
        }
      })
      .catch(e => {
        error = true;
        message = (e as AxiosError).message
      })
      .finally(() => {
        if (error) {
          setMsg({
            id: 'types of attendance status',
            title: 'Attendance Status',
            description: message,
            type: 'error',
          })
        }
        setStatusTypes(_statusTypes_)
      })
  }

  return {
    statusTypes,
    refreshStatusTypes
  }
}


function parseStatusTypeJson(json: { [key: string]: string }[]) {
  let arr = json as unknown as statusTypes[]
  if (arr.length > 0) {
    arr = arr.sort((a, b) => a.id - b.id)
    return arr as unknown as statusTypes[]
  }
  return []
}