import axios from 'axios';

export const API_URL = 'http://81.29.136.136:3001'
const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});



export default $api;