export const RGX_NUMBER = /[^0-9.]/g
export const RGX_CHARACTER = /[^A-Za-z ]/g
export const RGX_CHAR_NUM = /[^A-Za-z0-9 ]/g
export const PASSWORD_PATTERN =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=!])([A-Za-z0-9@#$%^&+=!]{8,})$/;