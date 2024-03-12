import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";
import { storage, useMessageHeader } from "~stores";
import { URI, dateFns, fetcher } from "~src/utils";
import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";

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

    let error = false;
    let message = 'success';
    let user = parseLoginJson({})

    await fetcher.postForm(URI.login, { email, password })
      .then(({ status, statusText, data }) => {
        const json = data as response;
        error = !(status === 200 ? json.status == 200 : false);
        message = status === 200 ? json.message : statusText;
        user = error ? parseLoginJson({}) : parseLoginJson(json.data);
      })
      .catch(e => {
        error = true;
        message = (e as AxiosError).message
      })
      .finally(() => {
        if (error) {
          setMsg({
            id: 'login',
            title: 'login',
            description: message,
            type: 'error'
          })
        }
        storeUser(user)
      })
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
