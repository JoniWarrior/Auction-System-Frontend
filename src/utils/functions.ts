import {Bounce, toast} from "react-toastify";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const showSuccess = (message: string, timeout = 2000) => {
    toast.success(message, {
        position: "top-center",
        autoClose: timeout,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
};

export const showError = (message: string, timeout = 3000) => {
    toast.error(message, {
        position: "top-center",
        autoClose: timeout,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
};

export const showInfo = (message: string, timeout = 2000) => {
    toast.info(message, {
        position: "top-center",
        autoClose: timeout,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
};

export const showWarning = (message: string, timeout = 2000) => {
    toast.warning(message, {
        position: "top-center",
        autoClose: timeout,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
};
