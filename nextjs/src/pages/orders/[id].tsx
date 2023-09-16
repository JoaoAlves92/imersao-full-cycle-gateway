import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import useSWR from "swr";
import Router, { useRouter } from "next/router";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { fetcher } from "@/lib/api";
import { formatCurrency } from "@/utils/price";
import { OrderStatus, OrderStatusTranslate } from "@/utils/models";

const OrderShowPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_HOST}/orders/${id}`,
    fetcher,
    {
      onError: (error) => {
        console.log(error);
        if (error.response.status === 401 || error.response.status === 403) {
          Router.push("/login");
        }
      },
    }
  );

  return data ? (
    <div>
      <Card>
        <CardHeader
          title="Order"
          subheader={data.id}
          titleTypographyProps={{ align: "center" }}
          subheaderTypographyProps={{
            align: "center",
          }}
          sx={{
            backgroundColor: (theme) => theme.palette.grey[700],
          }}
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography component="h2" variant="h3" color="text.primary">
              {formatCurrency(data.amount)}
            </Typography>

            <ul style={{ listStyle: "none", padding: 0 }}>
              <Typography component="li" variant="subtitle1">
                Número do cartão: <span>{data.credit_card_number}</span>
              </Typography>
              <Typography component="li" variant="subtitle1">
                Nome do cartão: <span>{data.credit_card_name}</span>
              </Typography>
              <Typography component="li" variant="subtitle1">
                Status:{" "}
                <span>{OrderStatusTranslate[data.status as OrderStatus]}</span>
              </Typography>
            </ul>
          </Box>
        </CardContent>
      </Card>
    </div>
  ) : null;
};

export default OrderShowPage;

export const getStaticProps: GetStaticProps = (context) => {
  return {
    props: {},
    revalidate: 20,
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
