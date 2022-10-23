export const BACKEND_URL = 'https://course-js.javascript.ru/';
export const API_URL_DASHBOARD = 'api/dashboard';
export const API_URL_REST = 'api/rest';

export const CLEAR_FILTERS_EVENT = 'clear-filters';
export const DATE_SELECT_EVENT = 'date-select';
export const ORDER_ITEMS_CHANGED = 'order-items-changed';
export const NOTIFICATION_EVENT = 'notification-event';

const date = new Date();
export const RANGE = {
  from: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
  to: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
};