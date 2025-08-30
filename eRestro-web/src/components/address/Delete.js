import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useAddress } from "../../context/AddressContext";
import { t } from "i18next";

const Delete = (id) => {
  const [open, setOpen] = React.useState(false);
  const { DeleteData } = useAddress();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const addressID = id.id;

  const delete_address = (address_id) => {
    DeleteData(address_id);
    handleClose(true);
  };
  return (
    <>
      <Button
        variant="text"
        onClick={handleClickOpen}
        color="error"
        sx={{ mt: "10px" }}
      >
        {t("delete")}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this address?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            autoFocus
            onClick={(e) => delete_address(addressID)}
            color="error"
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Delete;
