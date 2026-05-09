import {Suspense} from "react";
import OAuthSuccessPage from "@/components/auth/OAuthSuccessClient";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OAuthSuccessPage/>
        </Suspense>
    );
}