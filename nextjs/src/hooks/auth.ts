import axios from "axios";
import Router from "next/router";

export function useAuth() {
  const logout = async () => {
    try {
      await axios.post("/api/logout");
      Router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  return { logout };
}
