//apiConstants.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';


export const API_BASE = `${API_BASE_URL}`;
export const API_SEARCH_COLLECTS_URL = `${API_BASE_URL}/collects`
export const API_SAVE_URL = `${API_BASE_URL}/collects/save`
export const API_LOGIN = `${API_BASE_URL}/login`
export const API_ADDRESS = `${API_BASE_URL}/edress`
export const API_USER_TYPE = `${API_BASE_URL}/userType`
export const API_SEARCH_COLLECTS_DTO = `${API_BASE_URL}/collects/getDTO`
export const API_SEARCH_DELIVERIES_DTO = `${API_BASE_URL}/deliveries/getDTO`
export const API_SEARCH_USERS_DTO = `${API_BASE_URL}/users/getDTO`
export const API_SEARCH_ADRESS_DTO = `${API_BASE_URL}/edress/getDTO`
export const API_SEARCH_MOTOBOY = `${API_BASE_URL}/users/searchMotoboy`
export const API_SEARCH_DELIVERY_REGION = `${API_BASE_URL}/deliveryRegion`
export const API_SAVE_DELIVERY = `${API_BASE_URL}/deliveries/save`
export const API_EDIT_ADDRESS = `${API_BASE_URL}/edress/editAddress`
