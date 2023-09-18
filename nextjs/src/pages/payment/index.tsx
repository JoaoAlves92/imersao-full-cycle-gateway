import { Typography, Box, Grid } from "@mui/material";
import { GetServerSideProps } from "next";
import React from "react";
import { withIronSessionSsr } from "iron-session/next";
import ironConfig from "@/utils/iron-config";
import { BreadCrumbs, CreditCardItem, Input } from "@/ui-kit";
import * as Yup from "yup";
import CreditCardValidator from "card-validator";
import { Formik, Form } from "formik";

interface FormValues {
  amount: number;
  credit_card_number: string;
  credit_card_name: string;
  credit_card_expiration_month: string;
  credit_card_expiration_year: string;
  credit_card_cvv: string;
}

const PaymentPage = (props: any) => {
  const initialValues: FormValues = {
    amount: 0,
    credit_card_number: "",
    credit_card_name: "",
    credit_card_expiration_month: "",
    credit_card_expiration_year: "",
    credit_card_cvv: "",
  };

  const Schema = Yup.object().shape({
    amount: Yup.number()
      .required("Obrigatório")
      .positive("O valor deve ser maior que zero"),
    credit_card_number: Yup.string()
      .required("Obrigatório")
      .test("is-valid-credit-card", (value) => {
        const cardNumber = value.replace(/\s/g, "");
        return CreditCardValidator.number(cardNumber).isValid;
      }),
    credit_card_name: Yup.string().required("Obrigatório"),
    credit_card_expiration_month: Yup.string()
      .required("Obrigatório")
      .matches(/^(0[1-9]|1[0-2])$/, "Mês de vencimento inválido"),
    credit_card_expiration_year: Yup.string()
      .required("Obrigatório")
      .matches(/^\d{4}$/, "Ano de vencimento inválido"),
    credit_card_cvv: Yup.string()
      .required("Obrigatório")
      .matches(/^\d{3,4}$/, "CVV inválido"),
  });
  return (
    <div>
      <BreadCrumbs
        crumbs={[
          { href: "/", label: "Início", color: "inherit", underline: "hover" },
          { href: "/payment", label: "Pagamento", color: "text.primary" },
        ]}
      />
      <Typography component="h2" variant="h4" mt={2}>
        Pagamento
      </Typography>

      <Box>
        <Formik
          initialValues={initialValues}
          onSubmit={() => {}}
          validationSchema={Schema}
        >
          {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
            <Form>
              <Box>
                <Grid container spacing={2}>
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
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Input
                      id="credit_card_number"
                      name="credit_card_number"
                      label="Número do Cartão"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.credit_card_number}
                      size="small"
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
              <CreditCardItem />
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
