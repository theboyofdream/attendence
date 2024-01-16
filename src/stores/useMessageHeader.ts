import { useMMKVStorage } from "react-native-mmkv-storage";
import { storage } from "~stores";

export type MessageType = 'normal' | 'error' | 'success'
type Message = {
  id: string;
  title: string;
  description: string;
  type: MessageType
}

export function useMessageHeader() {
  const [msg, setMsg] = useMMKVStorage<Message | null>('msg', storage, { id: 'hii', title: 'title', description: 'description', type: 'error' })

  return {
    msg,
    setMsg
  }
}
