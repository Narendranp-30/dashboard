export const validatePassword = (password) => {
  const errors = [];
  
  // Minimum length of 8 characters
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  // Must contain at least one number
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  // Must contain at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const errors = [];
  
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if it's exactly 10 digits
  if (cleanNumber.length !== 10) {
    errors.push("Phone number must be exactly 10 digits");
  }
  
  // Check if it starts with a valid prefix (6-9 for Indian numbers)
  if (!/^[6-9]/.test(cleanNumber)) {
    errors.push("Phone number must start with 6, 7, 8, or 9");
  }
  
  // Check if it contains only numbers
  if (!/^\d+$/.test(cleanNumber)) {
    errors.push("Phone number must contain only digits");
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanNumber
  };
}; 