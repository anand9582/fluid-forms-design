import Swal from "sweetalert2";

// plain JS alert function
export const showAlert = (title, text = "", icon = "info", buttonColor = "#3b82f6", iconColor = undefined ) => {
  Swal.fire({
    title,
    text,
    icon,
    showConfirmButton: true,
    confirmButtonText: "OK",
    background: "linear-gradient(to bottom right, #f0f0f9 40%, #f0f0f9 100%)",
    color: "#0f172a",
    iconColor,
    timer: 1000,
    timerProgressBar: true,
    customClass: {
      popup: "rounded-xl shadow-lg",
      title: "text-2xl font-bold",
      htmlContainer: "text-base font-medium",
      confirmButton: `bg-[${buttonColor}] text-white px-4 py-2 rounded`,
    },
  });
};
