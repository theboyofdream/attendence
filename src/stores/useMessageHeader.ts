import { useState } from "react";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { storage } from "~stores";

export type MessageType = 'info' | 'error' | 'success'
type Message = {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'error' | 'success'
}

export function useMessageHeader() {
  const [msg, setMsg] = useMMKVStorage<Message | null>('msg', storage, { id: 'hii', title: 'title', description: 'description', type: 'error' })

  return {
    msg,
    setMsg
  }
}