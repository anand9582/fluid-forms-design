import Swal from "sweetalert2";

// Map of default colors for each icon type
const ICON_COLORS = {
  success: "#28a745", // green
  error: "#dc3545",   // red
  warning: "#E5BA41", // yellow/orange
  info: "#0d6efd",    // blue
  question: "#6c757d" // gray
};

const BUTTON_COLORS = {
  success: "#28a745",
  error: "#dc3545",
  warning: "#E5BA41",
  info: "#3b82f6",
  question: "#6c757d"
};

// plain JS alert function
export const showAlert = (
  title,
  text = "",
  icon = "info"
) => {
  const iconColor = ICON_COLORS[icon] || ICON_COLORS.info;
  const buttonColor = BUTTON_COLORS[icon] || BUTTON_COLORS.info;

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
      htmlContainer: "text-base font-medium pt-0",
      confirmButton: "text-white px-4 py-2 rounded",
    },
    didOpen: () => {
      // dynamically set button color
      const btn = Swal.getConfirmButton();
      if (btn) btn.style.backgroundColor = buttonColor;
    },
  });
};
