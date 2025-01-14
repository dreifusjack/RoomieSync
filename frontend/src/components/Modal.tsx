import { Box, Modal } from "@mui/material";

interface CustomModalProps {
  form: React.ReactNode;
  open: boolean;
  onClose: () => void;
}
const CustomModal: React.FC<CustomModalProps> = ({ form, open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-chore-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          backgroundColor: "#transparent",
        }}
      >
        {form}
      </Box>
    </Modal>
  );
};

export default CustomModal;
