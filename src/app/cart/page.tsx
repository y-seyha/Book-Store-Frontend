// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import CartClient from "@/components/cart/CartClient";

export default async function CartPage() {
    // const cookieStore = await cookies();
    //
    // const token = cookieStore.get("access_token")?.value;
    // console.log(token);
    //
    // if (!token) {
    //     redirect("/auth/signin");
    // }

    return <CartClient />;
}