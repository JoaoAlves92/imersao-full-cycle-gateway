import {
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  Button,
  Collapse,
  Alert,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { GetServerSideProps } from "next";
import React, { useState, useCallback } from "react";
import { withIronSessionSsr } from "iron-session/next";
import ironConfig from "@/utils/iron-config";
import { BreadCrumbs, CreditCardItem, Input } from "@/ui-kit";
import * as Yup from "yup";
import CardValidator from "creditcardutils";
import { Formik, Form } from "formik";
import { MONTHS } from "@/constants";
import { PatternFormat, NumericFormat } from "react-number-format";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useRouter } from "next/router";

export interface FormValues {
  amount: number;
  credit_card_number: string;
  credit_card_name: string;
  credit_card_expiration_month: number;
  credit_card_expiration_year: number;
  credit_card_cvv: string;
}

type Year = {
  id: number;
  label: string;
};

const PaymentPage = (props: any) => {
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const initialValues: FormValues = {
    amount: 0,
    credit_card_number: "",
    credit_card_name: "",
    credit_card_expiration_month: new Date().getMonth() + 1,
    credit_card_expiration_year: new Date().getFullYear(),
    credit_card_cvv: "",
  };

  const Schema = Yup.object().shape({
    amount: Yup.number()
      .required("Obrigatório")
      .positive("O valor deve ser maior que zero")
      .max(1000, "O valor não pode ser maior que 1000, regras da casa"),
    credit_card_number: Yup.string()
      .required("Obrigatório")
      .test("is-valid-credit-card", (value) => {
        const cardNumber = value.replace(/\s/g, "");
        return CardValidator.validateCardNumber(cardNumber);
      }),
    credit_card_name: Yup.string().required("Obrigatório"),
    credit_card_expiration_month: Yup.number().required("Obrigatório"),
    credit_card_expiration_year: Yup.number().required("Obrigatório"),
    credit_card_cvv: Yup.string()
      .required("Obrigatório")
      .matches(/^\d{3,4}$/, "CVV inválido"),
  });
  const currentYear = new Date().getFullYear();
  const years: Year[] = [];

  for (let i = currentYear; i <= currentYear + 10; i++) {
    years.push({ id: i, label: i.toString() });
  }

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const submitPayment = useCallback(async (values: any) => {
    console.log(values);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/payment`, {
        ...values,
      });

      setSuccess(true);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div>
      <BreadCrumbs
        crumbs={[
          { href: "/", label: "Início", color: "inherit", underline: "hover" },
          { href: "/payment", label: "Pagamento", color: "text.primary" },
        ]}
      />
      <Typography component="h2" variant="h4" mt={2} mb={isDesktop ? 6 : 2}>
        Pagamento
      </Typography>
      <Collapse in={success}>
        <Alert
          sx={{ mb: 2 }}
          variant="outlined"
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSuccess(false);
                router.push("/orders");
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          Seu pagamento foi recebido, confira na página de{" "}
          <Link href="/orders">Pedidos</Link>.
        </Alert>
      </Collapse>
      <Box>
        <Formik
          initialValues={initialValues}
          onSubmit={(values: FormValues) => {
            submitPayment(values);
          }}
          validationSchema={Schema}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: isDesktop ? 10 : 4,
                  height: "100%",
                  flexDirection: isDesktop ? "row" : "column",
                }}
              >
                <Box>
                  <Grid container rowSpacing={6} columnSpacing={2}>
                    <Grid item xs={12}>
                      <Input
                        id="credit_card_name"
                        name="credit_card_name"
                        label="Nome no Cartão"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.credit_card_name}
                        size="small"
                        fullWidth
                        required
                        error={
                          errors.credit_card_name && touched.credit_card_name
                            ? true
                            : false
                        }
                        helperText={
                          touched.credit_card_name && errors.credit_card_name
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <PatternFormat
                        format="#### #### #### ####"
                        allowEmptyFormatting
                        mask="_"
                        customInput={Input}
                        id="credit_card_number"
                        name="credit_card_number"
                        label="Número do Cartão"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.credit_card_number}
                        size="small"
                        fullWidth
                        required
                        error={
                          errors.credit_card_number &&
                          touched.credit_card_number
                            ? true
                            : false
                        }
                        helperText={
                          touched.credit_card_number &&
                          errors.credit_card_number
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        id="credit_card_expiration_month"
                        name="credit_card_expiration_month"
                        label="Mês de Vencimento"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.credit_card_expiration_month}
                        size="small"
                        fullWidth
                        required
                      >
                        {MONTHS.map((month, idx) => (
                          <MenuItem key={idx} value={month.id}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        id="credit_card_expiration_year"
                        name="credit_card_expiration_year"
                        label="Ano de Vencimento"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.credit_card_expiration_year}
                        size="small"
                        fullWidth
                        required
                      >
                        {years.map((year) => (
                          <MenuItem key={year.id} value={year.id}>
                            {year.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={4}>
                      <Input
                        id="credit_card_cvv"
                        name="credit_card_cvv"
                        label="CVV"
                        onChange={handleChange}
                        onBlur={() => setIsCvvFocused(false)}
                        onFocus={() => setIsCvvFocused(true)}
                        value={values.credit_card_cvv}
                        size="small"
                        fullWidth
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    alignItems: isDesktop ? "left" : "center",
                  }}
                >
                  <CreditCardItem values={values} isCvvFocused={isCvvFocused} />
                  <Box>
                    <NumericFormat
                      prefix="R$"
                      thousandSeparator
                      customInput={Input}
                      id="amount"
                      name="amount"
                      label="Valor"
                      // onChange={handleChange}
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        setFieldValue("amount", floatValue);
                      }}
                      onBlur={handleBlur}
                      value={values.amount}
                      size="small"
                      fullWidth
                      required
                      error={errors.amount && touched.amount ? true : false}
                      helperText={touched.amount && errors.amount}
                    />
                    <Button
                      variant="outlined"
                      type="submit"
                      sx={{ my: 2, width: "100%" }}
                    >
                      Finalizar Doação
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
  );
};

export default PaymentPage;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async (context) => {
    const account = context.req.session.account;

    if (!account) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  },
  ironConfig
);
