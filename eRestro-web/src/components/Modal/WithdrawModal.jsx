import {
  Box,
  Modal,
  Typography,
  Textarea,
  Button,
  ModalDialog,
  ModalClose,
  Input,
} from "@mui/joy";
import { DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as api from "../../utils/api";
import toast from "react-hot-toast";

import { useDispatch } from "react-redux";
import { setWallet } from "../../store/reducers/WalletData";

const WithdrawModal = ({ balance, openModal, setOpenModal }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(openModal);
  const handleClose = () => {
    setOpen(false);
    setOpenModal(false);
  };
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState("");

  const style = {
    border: "2px solid #000",
    boxShadow: 24,

    p: 4,
    width: { xs: "100%", md: 700 },
    borderRadius: "8px",
    color: "black",
  };

  // Catch Rating value

  const dispatch = useDispatch();
  const handleOrderRating = () => {
    if (parseFloat(amount) > parseFloat(balance)) {
      return toast.error(t("insufficient_balance"));
    }

    api.send_withdraw_requset(parseFloat(amount), comment).then((res) => {
      if (res.error === true) {
        return toast.error(res.message);
      } else {
        api.get_settings().then((result) => {
          if (result.error === false) {
            dispatch(setWallet(result?.data?.user_data));
          }
        });

        toast.success(res.message);
        // handleClose();
        return;
      }
    });
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={(e) => handleClose()}
    >
      <ModalDialog color="background.paper" variant="soft">
        <ModalClose
          sx={{
            borderRadius: "20px",
            backgroundColor: "white",
            transition: "background-color 0.1s ease",
            "&:hover": {
              backgroundColor: "lightgray",
              transitionDelay: "0.2s",
            },
          }}
          onClick={(e) => handleClose()}
        />

        <Box sx={style}>
          <DialogTitle
            display={"flex"}
            sx={{ px: 0, pt: 0 }}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography
              variant="h4"
              sx={{ color: "black" }}
              fontWeight={"bold"}
            >
              {" "}
              {t("send_withdraw_request")}{" "}
            </Typography>
          </DialogTitle>

          <hr />

          <Box>
            <Box>
              <Typography variant="h6" sx={{ color: "black" }}>
                {" "}
                {t("amount")}{" "}
              </Typography>
              <Input
                type="number"
                placeholder={t("withdraw_amount_placeholder")}
                size="lg"
                variant="soft"
                color="neutral"
                value={amount}
                slotProps={{ input: { min: 0 } }}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "black" }}>
                {" "}
                {t("payment_address")}{" "}
              </Typography>
              <Textarea
                placeholder={t("payment_address_details")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Box>

            <Box mt={2}>
              <Button onClick={(e) => handleOrderRating()}>
                {" "}
                {t("give_rating")}{" "}
              </Button>
            </Box>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default WithdrawModal;
