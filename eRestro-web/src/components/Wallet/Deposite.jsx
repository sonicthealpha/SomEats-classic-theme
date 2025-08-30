import { Box, Card, CardContent, FormHelperText, FormLabel, Input, Radio, RadioGroup } from '@mui/joy';
import { FormControlLabel } from '@mui/material';
import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import RazorPay from './RazorPay';
import Stripe from './Stripe';
import Flutterwave from './Flutterwave';
import PayStack from './PayStack';
import PayPal from './PayPal';
import { useTranslation } from 'react-i18next';

const Deposite = () => {
    const [status, setStatus] = useState(0);
    const [amount, setAmount] = useState(0);
    const paymentHandler = (active_status) => {
        setStatus(active_status);
    };
    const { t } = useTranslation();


    const settings = useSelector((state) => state.settings)?.payment_data
        ?.payment_method;

    return (
        <Card variant="soft" color="neutral" sx={{ minWidth: 343 }}>

            <Box>
                <FormLabel>{t('amount')}</FormLabel>
                <Input
                    placeholder="Add Amount to be recharged"
                    variant="plain" value={amount}
                    onChange={e => setAmount(e.target.value)} />

                <FormHelperText> {t("please_fill_in_the_amount_you_want_to_deposite")} </FormHelperText>
            </Box>

            <CardContent>
                <RadioGroup
                    aria-labelledby="demo-form-control-label-placement"
                    name="position"
                    className="payment"
                    defaultValue="top"
                >

{/* 
                    {settings.razorpay_payment_method === "1" ||
                        settings.razorpay_payment_method === 1 ? (
                        <Radio
                            variant="outlined"
                            color="primary"
                            value={"RazorPay"}
                            label="RazorPay"
                            onClick={(e) => paymentHandler(2)}
                        />
                    ) : (
                        ""
                    )} */}

                    {settings.paypal_payment_method === "1" ||
                        settings.paypal_payment_method === 1 ? (
                        <Radio
                            variant="outlined"
                            color="primary"
                            value={"Paypal"}
                            label="Paypal"
                            onClick={(e) => paymentHandler(6)}
                        />
                    ) : (
                        ""
                    )}

                    {settings.stripe_payment_method === "1" ||
                        settings.stripe_payment_method === 1 ? (
                        <Radio
                            variant="outlined"
                            color="primary"
                            value={"Stripe"}
                            label="Stripe"
                            onClick={(e) => paymentHandler(3)}
                        />
                    ) : (
                        ""
                    )}

                    {settings.flutterwave_payment_method === "1" ||
                        settings.flutterwave_payment_method === 1 ? (
                        <Radio
                            variant="outlined"
                            color="primary"
                            value={"FlutterWave"}
                            label="FlutterWave"
                            onClick={(e) => paymentHandler(4)}
                        />
                    ) : (
                        ""
                    )}
                    {settings.paystack_payment_method === "1" ||
                        settings.paystack_payment_method === 1 ? (
                        <Radio
                            variant="outlined"
                            color="primary"
                            value={"PayStack"}
                            label="PayStack"
                            onClick={(e) => paymentHandler(5)}
                        />
                    ) : (
                        ""
                    )}
                </RadioGroup>

                {/* {status === 2 && (
                    <>
                        <RazorPay amount={amount} />
                    </>
                )} */}
                {status === 3 && (
                    <>
                        <Stripe amount={amount} />
                    </>
                )}
                {status === 4 && (
                    <>
                        <Flutterwave amount={amount} />
                    </>
                )}
                {status === 5 && (
                    <>
                        <PayStack amount={amount} />
                    </>
                )}
                {status === 6 && (
                    <>
                        <PayPal amount={amount} />
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default Deposite