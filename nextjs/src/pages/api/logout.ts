import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import ironConfig from "@/utils/iron-config";

export default withIronSessionApiRoute(logout, ironConfig);

async function logout(req: NextApiRequest, res: NextApiResponse) {
  try {
    req.session.destroy();
    res.writeHead(302, { Location: "/login" });
    res.end();
  } catch (e) {
    console.error(e);
  }
}
