import React from "react";

interface ModalProps {
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  const handleClose = () => {
    onClose(); // Menjalankan fungsi penutupan modal
    window.location.reload(); // Refresh halaman
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <p style={styles.message}>{message}</p>
        <button style={styles.button} onClick={handleClose}>
          OK
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-in-out",
  },
  modal: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    textAlign: "center" as const,
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
    minWidth: "300px",
    maxWidth: "90%",
  },
  message: {
    fontSize: "16px",
    color: "#333", // Warna teks lebih gelap
    fontWeight: "bold",
    marginBottom: "12px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    border: "none",
    background: "#007BFF",
    color: "white",
    fontSize: "14px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease-in-out",
  },
  buttonHover: {
    background: "#0056b3",
  },
};

export default Modal;