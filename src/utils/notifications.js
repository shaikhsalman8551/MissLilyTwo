import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Toast notification helper
export const showToast = (title, message, type = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  Toast.fire({
    icon: type,
    title: title,
    text: message
  });
};

// Success notification
export const showSuccess = (title, message) => {
  showToast(title, message, 'success');
};

// Error notification
export const showError = (title, message) => {
  showToast(title, message, 'error');
};

// Warning notification
export const showWarning = (title, message) => {
  showToast(title, message, 'warning');
};

// Info notification
export const showInfo = (title, message) => {
  showToast(title, message, 'info');
};

// Confirmation dialog
export const showConfirm = async (title, text, confirmButtonText = 'Yes', cancelButtonText = 'No') => {
  return await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText
  });
};

// Loading dialog
export const showLoading = (title = 'Loading...', text = 'Please wait') => {
  Swal.fire({
    title: title,
    text: text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close loading dialog
export const closeLoading = () => {
  Swal.close();
};

// Success dialog with redirect
export const showSuccessWithRedirect = async (title, text, redirectUrl) => {
  await Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    showConfirmButton: true,
    confirmButtonText: 'OK'
  });
  
  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
};

// Error dialog
export const showErrorDialog = (title, text) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: 'OK'
  });
};
