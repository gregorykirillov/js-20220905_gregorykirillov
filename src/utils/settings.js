export const BACKEND_URL = 'https://course-js.javascript.ru/';
export const API_URL_DASHBOARD = 'api/dashboard';
export const API_URL_REST = 'api/rest';

export const DATE_SELECT_EVENT = 'date-select';
export const CLEAR_FILTERS_EVENT = 'clear-filters';
export const PRODUCT_UPDATED_EVENT = 'product-updated';
export const PRODUCT_SAVED_EVENT = 'product-saved';

const date = new Date();
export const RANGE = {
  from: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()),
  to: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59),
};