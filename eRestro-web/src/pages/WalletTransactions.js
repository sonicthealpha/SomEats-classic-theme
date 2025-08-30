import React, { useState, useEffect } from "react";
import * as api from "../utils/api";
import Nofound from "./Nofound";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Pagination } from "@mui/material";
import { Box, Stack } from "@mui/joy";
import { t } from "i18next";
import ApiErrorPage from "./ApiErrorPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    custom: {
      main: "#dd4a48", // Your custom color value
    },
  },
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#dd4a48",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
    fontWeight: "normal",
  },
}));

const WalletTransactions = () => {
  const [transactions, setTransactions] = useState();
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState(null);
  const [apiError, setApiError] = useState(false);

  const walletTransactions = async () => {
    try {
      setApiError(false);
      const response = await api.transactions(limit, offset, search, "wallet");
      if (!response.error) {
        setApiError(false);
        //console.log(response);
        setTotal(response.total);
        setTransactions(response.data);
      }
    } catch (error) {
      setApiError(true);
    }
  };

  useEffect(() => {
    walletTransactions();
  }, [limit, offset]);

  const handlePageChange = (e, page) => {
    // console.log(page);
    setOffset(page * limit);
  };

  return (
    <>
      {!apiError ? (
        <Box>
          {transactions && transactions.length > 0 ? (
            <Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 800 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>{t("amount")}</StyledTableCell>
                      <StyledTableCell align="center">
                        {t("order_id")}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {t("type")}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {t("transaction_id")}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {t("message")}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions &&
                      transactions.map((transaction, index) => {
                        const { amount, order_id, type, txn_id, message } =
                          transaction;
                        return (
                          <StyledTableRow key={index}>
                            <StyledTableCell
                              component="th"
                              scope="row"
                              style={{ color: "green" }}
                            >
                              $ {amount}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {order_id}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {type}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {txn_id}121
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {message === "null" || message === null
                                ? "---"
                                : message}
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display={"flex"} justifyContent={"center"} mt={4}>
                <Stack spacing={2}>
                  <ThemeProvider theme={theme}>
                    <Pagination
                      count={Math.ceil(total / limit) - 1}
                      onChange={(event, page) => handlePageChange(event, page)}
                      showFirstButton
                      showLastButton
                      variant="outlined"
                      color="custom"
                    />
                  </ThemeProvider>
                </Stack>
              </Box>
            </Box>
          ) : (
            <>
              <Nofound />
            </>
          )}
        </Box>
      ) : (
        <Box
          mt={-25}
          sx={{
            ml: {
              xs: 0, // No margin-left for extra small screens
              sm: 0, // No margin-left for small screens
              md: 30, // Margin-left of 30 for medium screens
            },
          }}
        >
          <ApiErrorPage onRetry={walletTransactions} />
        </Box>
      )}
    </>
  );
};

export default WalletTransactions;
