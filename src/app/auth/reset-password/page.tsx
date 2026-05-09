import {Suspense} from "react";
import ResetPasswordPage from "@/components/auth/ResetPassword";


export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPage/>
        </Suspense>
    );
}