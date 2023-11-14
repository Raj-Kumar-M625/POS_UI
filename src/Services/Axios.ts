import axios, { AxiosInstance } from "axios";
import { BASE_URL } from "../Constants/Urls";

function InitializePrivateAxios(): AxiosInstance {
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser: any = JSON.parse(json);
  const privateAxios: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${sessionUser?.token}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, PATCH, POST, DELETE",
      "Access-Control-Allow-Headers": "access-control-request-headers",
    },
  });
  return privateAxios;
}

//POST
export async function Post<T>(url: string, data: any): Promise<T> {
  let response: any;
  const privateAxios: AxiosInstance = InitializePrivateAxios();
  try {
    response = await privateAxios.post(url, data);
  } catch (e: any) {
    response = { error: true, response: e };
  }
  return response;
}

//GET
export async function Get<T>(url: string): Promise<T> {
  let response: any;
  const privateAxios: AxiosInstance = InitializePrivateAxios();
  try {
       response = await privateAxios.get(url);
  } catch (e) {
    response = e;
  }

  return response;
}

//PUT
export async function Put<T>(url: string, data: any): Promise<T> {
  let response: any;
  const privateAxios: AxiosInstance = InitializePrivateAxios();
  try {
    response = await privateAxios.put(url, data);
  } catch (e) {
    response = e;
  }
  return response;
}

export async function PostFiles<T>(url: string, data: T): Promise<T> {
  let response: any;
  const json: any = sessionStorage.getItem("user") || null;
  const sessionUser = JSON.parse(json);

  const headers = {
    "content-type": "multipart/form-data",
    Authorization: `Bearer ${sessionUser.token}`,
  };

  try {
    response = await axios.post(`${BASE_URL}${url}`, data, {
      headers,
    });
  } catch (err) {
    response = { error: true };
  }
  return response;
}

