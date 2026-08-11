import { toast } from "react-toastify";
// function to prevent adding number or any special character
export const validateInputs = (value) => {
  const regex = /^[A-Za-z\s]*$/;
  if (regex.test(value)) {
    return true;
  } else {
    toast.error("Digits and Special Characters not allowed", {
      duration: 500,
    });
    return false;
  }
};
