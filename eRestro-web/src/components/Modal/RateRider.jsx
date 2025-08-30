import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Textarea,
  Button,
  ModalDialog,
  ModalClose,
} from "@mui/joy";
import { DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Rating } from "react-simple-star-rating";
import * as api from "../../utils/api";
import toast from "react-hot-toast";

const RateRider = ({ rider_id, rateModal, setRateModal }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(rateModal);
  const handleClose = () => {
    setOpen(false);
    setRateModal(false);
  };
  const [rating, setRating] = useState(0);
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
  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleOrderRating = () => {
    api.give_rider_rating(rider_id, rating, comment).then((res) => {
      if (res.error === true) {
        return toast.error(res.message);
      } else {
        toast.success(res.message);
        handleClose();
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
            "&:hover": {
              backgroundColor: "lightgray",             
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
              {t("rating_rider_modal_title")}{" "}
            </Typography>
          </DialogTitle>

          <hr />

          <Box>
            <Box>
              <Typography variant="h6" sx={{ color: "black" }}>
                {" "}
                {t("rate")}{" "}
              </Typography>
              <Rating onClick={handleRating} initialValue={rating} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: "black" }}>
                {" "}
                {t("comment")}{" "}
              </Typography>
              <Textarea
                placeholder="Share Your Thoughts or views regarding this Rider"
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

export default RateRider;
