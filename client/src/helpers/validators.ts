export const required = (value: any) => (value ? undefined : 'This field is required');

export const isEmail = (value: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(value) ? undefined : 'Invalid email address';
};

export const isMobileNumber = (value: string) => {
  const phoneRegex = /^[0-9]{10,15}$/; // Assuming mobile number should have 10-15 digits
  return phoneRegex.test(value) ? undefined : 'Invalid mobile number';
};

export const maxLengthMobileNo = (value: string) => (value.length <= 15 ? undefined : 'Mobile number too long');
export const minLengthMobileNo = (value: string) => (value.length >= 10 ? undefined : 'Mobile number too short');
export const digit = (value: string) => /^[0-9]+$/.test(value) ? undefined : 'Mobile number must be numeric';
