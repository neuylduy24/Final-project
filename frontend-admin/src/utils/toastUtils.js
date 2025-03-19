import { toast } from 'react-toastify';

// Tùy chọn mặc định cho toast
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Các hàm tiện ích hiển thị toast
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

// Hiển thị toast thành công khi thêm mới
export const toastAddSuccess = (item = 'dữ liệu') => {
  return toastSuccess(`Thêm ${item} thành công!`);
};

// Hiển thị toast thành công khi cập nhật
export const toastUpdateSuccess = (item = 'dữ liệu') => {
  return toastSuccess(`Cập nhật ${item} thành công!`);
};

// Hiển thị toast thành công khi xóa
export const toastDeleteSuccess = (item = 'dữ liệu') => {
  return toastSuccess(`Xóa ${item} thành công!`);
};

// Hiển thị toast lỗi
export const toastErrorMessage = (error) => {
  const message = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra!';
  return toastError(message);
}; 