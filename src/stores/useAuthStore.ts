import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";
import { storage, useMessageHeader } from "~stores";
import { URI, dateFns, fetcher } from "~src/utils";
import { useEffect, useMemo, useState } from "react";

type response = {
  status: number,
  message: string,
  data: { [key: string]: string }
}

export type User = {
  id: number;
  franchiseId: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  dateOfJoining: Date | null;
  picture: string;
  inTime: Date | null;
  outTime: Date | null;
  loggedIn: boolean
}

export function useAuthStore() {
  const [user, storeUser] = useMMKVStorage('user', storage, parseLoginJson({}));
  const { setMsg } = useMessageHeader()

  async function login(email: string, password: string) {
    const { status, statusText, data } = await fetcher.postForm(URI.login, { email, password });
    const json = data as response;

    const error = !(status === 200 ? json.status == 200 : false);
    const message = status === 200 ? json.message : statusText;
    const user = error ? parseLoginJson({}) : parseLoginJson(json.data);

    if (error) {
      setMsg({
        id: 'login',
        title: 'login',
        description: message,
        type: 'error'
      })
    }

    storeUser(user)
  }

  function logout() {
    storage.clearStore();
  }

  return {
    user: { ...user, dateOfJoining: new Date(user.dateOfJoining || new Date()) },
    login,
    logout
  }
}

function parseLoginJson(json: { [key: string]: string }): User {
  return {
    id: parseInt(json['user_id'] ?? 0),
    franchiseId: parseInt(json['fk_franchise_id'] ?? 0),
    firstname: json['user_firstname'] || '',
    lastname: json['user_lastname'] || '',
    email: json['user_email'] || '',
    mobile: json['user_mob'] || '',
    dateOfJoining: dateFns.parseDate(json['date_of_joining'], 'date'),
    picture: json['user_pic'] || 'https://placehold.jp/100x100.png',
    inTime: dateFns.parseDate(json['in_time'], 'time'),
    outTime: dateFns.parseDate(json['out_time'], 'time'),
    loggedIn: parseInt(json['user_id']) > 0
  }
}
