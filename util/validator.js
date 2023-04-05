export const noSpaceRegex = /^\S*$/;
export const min10CharsRegex = /^.{10,}$/;
export const max30CharsRegex = /^.{0,30}$/;
export const lowercaseRegex = /[a-z]/;
export const uppercaseRegex = /[A-Z]/;
export const numericCharRegex = /\d/;
export const specialCharRegex = /[!@#$%^&*(),.?":{}|<>\[\]\/\\]/;
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>\[\]\\\/])\S{12,30}$/;
export const emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
export const usernameRegex = /^[\w ,.'-]+$/;

export const emailValidators = {
  validators: ["required", `matchRegexp:${emailRegex.source}`],
  errorMessages: ["This field is required.", "Invalid email format."],
};

export const usernameValidators = {
  validators: ["required", `matchRegexp:${usernameRegex.source}`],
  errorMessages: ["This field is required.", "Invalid username format."],
};

export const requiredValidators = {
  validators: ["required"],
  errorMessages: ["This field is required."],
};
