export const BACKEND_URL = 'https://course-js.javascript.ru/';
export const API_URL_DASHBOARD = 'api/dashboard';
export const API_URL_REST = 'api/rest';


const date = new Date();
export const RANGE = {
  from: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
  to: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
};