import { Box, Modal, Typography, IconButton, ModalDialog, ModalClose, Grid } from '@mui/joy';
import { DialogTitle } from '@mui/material';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const CitiesModel = ({ cities, cityModel, setCityModel }) => {

    const { t } = useTranslation();
    const [open, setOpen] = useState(cityModel);
    const handleClose = () => { setOpen(false); setCityModel(false) };
    const demoMOde = process.env.REACT_APP_DEMO_MODE || "true";



    const style = {

        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        width: { xs: '100%', md: 700 },
        borderRadius: "8px",
        color: 'black',
    };

    const handleCity = (city) => {
        localStorage.setItem("city", demoMOde === "true" ? 1 : city.id);
        localStorage.setItem("current_city", demoMOde === "true" ? "bhuj" : city.name);
        localStorage.setItem("longitude",  demoMOde === "true" ? "23.2419997" :  city.longitude);
        localStorage.setItem("latitude", demoMOde === "true" ? "69.6669324" : city.latitude);
        console.log(city);
        window.location.reload();
    }



    return (
        <Modal
            open={open}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onClose={e => handleClose()}
        >

            <ModalDialog
                color="primary"
                variant="soft"
            >

                <ModalClose onClick={e => handleClose()} />

                <Box sx={style}>

                    <DialogTitle display={"flex"} sx={{ px: 0, pt: 0 }} justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant="h4" sx={{ color: 'black' }} fontWeight={"bold"}> {t("city_we_deliver")} </Typography>
                    </DialogTitle>

                    <hr />


                    <Box>
                        <Grid container spacing={2} sx={{ flexGrow: 1 }} mt={3}>
                            {cities &&
                                cities.map((city, index) => (
                                    <Grid xs={6} >
                                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} border={"1px gray solid"} borderRadius={"5px"} px={1}
                                            sx={{
                                                '&:hover': {
                                                    border: "1px black solid",
                                                    transition: 'border 0.3s ease-in-out',
                                                },
                                                cursor: "pointer"
                                            }}
                                            onClick={e => handleCity(city)}

                                        >
                                            <Typography variant="subtitle1" component="h6">
                                                {city.name}
                                            </Typography>
                                            <IconButton
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    },
                                                }}
                                            >
                                                <OpenInNewIcon />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                ))}
                        </Grid>

                    </Box>
                </Box>

            </ModalDialog>
        </Modal>
    )
}

export default CitiesModel