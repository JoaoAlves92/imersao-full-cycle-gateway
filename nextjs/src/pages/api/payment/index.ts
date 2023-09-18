import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import axios from "axios";
import ironConfig from "@/utils/iron-config";

export default withIronSessionApiRoute(Payment, ironConfig);

async function Payment(req: NextApiRequest, res: NextApiResponse) {
  const account = req.session.account;

  const {
    amount,
    credit_card_number,
    credit_card_name,
    credit_card_expiration_month,
    credit_card_expiration_year,
    credit_card_cvv,
  } = req.body;

  if (!account) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  try {
    const { data } = await axios.post(
      `${process.env.NEST_API_HOST}/orders`,
      {
        amount,
        credit_card_number,
        credit_card_name,
        credit_card_expiration_month,
        credit_card_expiration_year,
        credit_card_cvv,
      },
      {
        headers: {
          "x-token": account.token,
        },
      }
    );
    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    if (axios.isAxiosError(e)) {
      res.status(e.response!.status).json(e.response?.data);
    } else {
      res.status(500).json({ message: "Ocorreu um erro interno" });
    }
  }
}
