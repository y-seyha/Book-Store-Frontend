import {Suspense} from "react";
import VerifySuccessClient from "@/components/auth/VerifySuccessClient";


export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifySuccessClient/>
        </Suspense>
    );
}