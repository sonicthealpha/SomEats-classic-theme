import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import Nofound from "./Nofound";
import { useSelector, useDispatch } from "react-redux";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AspectRatio,
  Box,
  Button,
  Card,
  CardContent,
  Sheet,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import WithdrawModal from "../components/Modal/WithdrawModal";
import { selectData } from "../store/reducers/settings";
import Deposite from "../components/Wallet/Deposite";
import { setWallet } from "../store/reducers/WalletData";

const Wallet = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.get_settings();
        if (result.error === false) {
          dispatch(setWallet(result?.data?.user_data));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchData();
  }, []);
  const [open, setOpen] = useState(false);
  const [amout, setAmount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const data = useSelector((state) => state.wallet)?.wallet;

  let wallet = data;

  const { t } = useTranslation();
  const details = useSelector(selectData);
  const currency = details.currency;

  return (
    <Box>
      <Box maxWidth={"100%"} maxHeight={"100%"}>
        {/* User Card */}
        <Box
          sx={{
            width: "100%",
            position: "relative",
            overflow: { xs: "auto", sm: "initial" },
          }}
        >
          <Card
            orientation="horizontal"
            sx={{
              width: "100%",
              flexWrap: "wrap",
              [`& > *`]: {
                "--stack-point": "500px",
                minWidth:
                  "clamp(0px, (calc(var(--stack-point) - 2 * var(--Card-padding) - 2 * var(--variant-borderWidth, 0px)) + 1px - 100%) * 999, 100%)",
              },
              // make the card resizable for demo
              overflow: "auto",
              resize: "horizontal",
            }}
          >
            <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
              <img
                src="https://picsum.photos/200/300"
                srcSet="https://picsum.photos/182/182 2x"
                loading="lazy"
                alt=""
              />
            </AspectRatio>
            <CardContent>
              <Typography fontSize="xl" fontWeight="lg">
                {wallet[0]?.username}
              </Typography>
              <Typography
                level="body-sm"
                fontWeight="lg"
                textColor="text.tertiary"
                display={"flex"}
                flexDirection={"column"}
              >
                <Box>{wallet[0]?.email}</Box>
                <Box>{wallet[0]?.mobile}</Box>
              </Typography>
              <Sheet
                sx={{
                  bgcolor: "background.level1",
                  borderRadius: "sm",
                  p: 1.5,
                  my: 1.5,
                  display: "flex",
                  gap: 2,
                  "& > div": { flex: 1 },
                }}
              >
                <div>
                  <Typography level="body-xs" fontWeight="lg">
                    {t("balance")}
                  </Typography>
                  <Typography fontWeight="lg" textColor={"green"}>
                    {currency}
                    {isNaN(parseFloat(wallet[0]?.balance))
                      ? "0.00"
                      : parseFloat(wallet[0]?.balance).toFixed(2)}
                  </Typography>
                </div>
              </Sheet>
              <Box
                sx={{ display: "flex", gap: 1.5, "& > button": { flex: 1 } }}
              >
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={(e) => {
                    setOpen(true);
                    setAmount(wallet[0]?.balance);
                  }}
                >
                  {t("withdraw")}
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={(e) => toggleAccordion()}
                >
                  {t("deposit")}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Payment Gateway for Wallet */}
          <AccordionGroup transition="0.2s ease">
            <Accordion expanded={isOpen}>
              <Box m={2}>
                <AccordionDetails>
                  <Deposite />
                </AccordionDetails>
              </Box>
            </Accordion>
          </AccordionGroup>
        </Box>
      </Box>

      {open === true ? (
        <WithdrawModal
          balance={amout}
          openModal={open}
          setOpenModal={setOpen}
        />
      ) : (
        ""
      )}
    </Box>
  );
};

export default Wallet;
