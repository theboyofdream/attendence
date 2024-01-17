import { useEffect } from "react";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { storage } from "~stores";

export type MessageType = 'normal' | 'error'
type Message = {
  id: string;
  title: string;
  description: string;
  type: MessageType;
  actionName?: string;
  action?: (id: string) => void;
}

export function useMessageHeader() {
  const [msg, setMsg] = useMMKVStorage<Message | null>('msg', storage)


  // useEffect(() => {
  //   setMsg({ id: 'hii', title: 'title', description: 'description', type: 'error' })
  // }, [])

  return {
    msg,
    setMsg
  }
}
