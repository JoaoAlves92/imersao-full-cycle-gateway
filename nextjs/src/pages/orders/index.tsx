import { Typography, Link as MuiLink } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import { withIronSessionSsr } from "iron-session/next";
import ironConfig from "@/utils/iron-config";
import { OrderStatus, OrderStatusTranslate } from "@/utils/models";
import { fetcher } from "@/lib/api";
import useSWR from "swr";
import Router from "next/router";
import { formatCurrency } from "@/utils/price";

const OrdersPage = (props: any) => {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 300,
      renderCell: (params) => {
        return (
          <MuiLink component={Link} href={`/orders/${params.value}`}>
            {params.value}
          </MuiLink>
        );
      },
    },
    {
      field: "amount",
      headerName: "Valor",
      width: 100,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: "credit_card_number",
      headerName: "Núm. Cartão Crédito",
      width: 200,
      sortable: false,
    },
    {
      field: "credit_card_name",
      headerName: "Nome Cartão Crédito",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      valueFormatter: (params) =>
        OrderStatusTranslate[params.value as OrderStatus],
    },
  ];

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_HOST}/orders`,
    fetcher,
    {
      fallbackData: props.orders,
      refreshInterval: 10 * 1000,
      onError: (error) => {
        console.log(error);
        if (error.response.status === 401 || error.response.status === 403) {
          Router.push("/login");
        }
      },
    }
  );

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Typography component="h2" variant="h4">
        Minhas ordens
      </Typography>
      <DataGrid sx={{ mt: 4 }} columns={columns} rows={data} />
    </div>
  );
};

export default OrdersPage;

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
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/orders`,
      {
        headers: {
          cookie: context.req.headers.cookie as string,
        },
      }
    );

    return {
      props: {
        orders: data,
      },
    };
  },
  ironConfig
);
