import { useEffect, useState } from "react";
import { useAuthStore } from "~stores";
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
  const [statusTypes, setStatusTypes] = useState<statusTypes[]>([])

  async function refreshStatusTypes() {
    const { status, statusText, data } = await fetcher.postForm(URI["types of attendance status"], { user_id: user.id, franchise_id: user.franchiseId });
    const json = data as response;

    const error = !(status === 200 ? json.status == 200 : false);
    const message = status === 200 ? json.message : statusText;
    const types = status === 200 ? parseStatusTypeJson(json.data) : parseStatusTypeJson([]);

    setStatusTypes(types)
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