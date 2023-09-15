import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import useSWR from "swr";
import Router, { useRouter } from "next/router";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { fetcher } from "@/lib/api";
import { formatCurrency } from "@/utils/price";

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
              justifyContent: "center",
              alignItems: "baseline",
              mb: 2,
            }}
          >
            <Typography component="h2" variant="h3" color="text.primary">
              {formatCurrency(data.amount)}
            </Typography>
          </Box>
          <ul style={{ listStyle: "none" }}>
            <Typography component="li" variant="subtitle1">
              {data.credit_card_number}
            </Typography>
            <Typography component="li" variant="subtitle1">
              {data.credit_card_name}
            </Typography>
          </ul>
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
