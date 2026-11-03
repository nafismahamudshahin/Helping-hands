import { toast } from "sonner";
import { authClient } from "./auth-client"



export const getClientJwtToken = async () => {
    const { data, error } = await authClient.token();
    if (error) {
        toast.error("Invalid Token Found!")
    }
    return data?.token;
}