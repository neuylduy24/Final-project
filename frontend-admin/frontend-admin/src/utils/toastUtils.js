import { toast } from 'react-toastify';

// Default options for toast
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Utility functions for displaying toasts
export const toastSuccess = (message, options = {}) => {
  return toast.success(message, { ...defaultOptions, ...options });
};

export const toastError = (message, options = {}) => {
  return toast.error(message, { ...defaultOptions, ...options });
};

export const toastInfo = (message, options = {}) => {
  return toast.info(message, { ...defaultOptions, ...options });
};

export const toastWarning = (message, options = {}) => {
  return toast.warning(message, { ...defaultOptions, ...options });
};

// Display success toast when adding new item
export const toastAddSuccess = (item = 'data') => {
  return toastSuccess(`Added ${item} successfully!`);
};

// Display success toast when updating
export const toastUpdateSuccess = (item = 'data') => {
  return toastSuccess(`Updated ${item} successfully!`);
};

// Display success toast when deleting
export const toastDeleteSuccess = (item = 'data') => {
  return toastSuccess(`Deleted ${item} successfully!`);
};

// Display error toast
export const toastErrorMessage = (error) => {
  const message = error?.response?.data?.message || error?.message || 'An error occurred!';
  return toastError(message);
}; 