import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getServerJwtToken = async () => {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  return token;
};
