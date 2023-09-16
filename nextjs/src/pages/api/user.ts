import { withIronSessionApiRoute } from "iron-session/next";
import ironConfig from "@/utils/iron-config";
import { NextApiRequest, NextApiResponse } from "next";

export type User = {
  isLoggedIn: boolean;
  name: string;
  token: string;
  id?: number;
};

export default withIronSessionApiRoute(userRoute, ironConfig);

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.account) {
    res.json({
      ...req.session.account,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
      name: "",
      token: "",
    });
  }
}
