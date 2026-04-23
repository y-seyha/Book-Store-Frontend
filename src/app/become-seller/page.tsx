"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {apiGet, apiPost, createBrowserApiClient} from "@/lib/api.helper";
import FloatingInput from "@/components/ui/FloatingInput";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

type SellerForm = {
    store_name: string;
    store_description: string;
    store_address: string;
    phone: string;
};

export default function BecomeSellerPage() {
    const client = createBrowserApiClient();
    const router = useRouter();

    const [form, setForm] = useState<SellerForm>({
        store_name: "",
        store_description: "",
        store_address: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);

    // check if user already applied
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await apiGet<any>(client, "/sellers/me");
                if (res?.store_name) {
                    setForm({
                        store_name: res.store_name || "",
                        store_description: res.store_description || "",
                        store_address: res.store_address || "",
                        phone: res.phone || "",
                    });
                }
            } catch (err) {
              console.log(err);
            }
        };

        fetchMe();
    }, []);

    const handleChange = (key: keyof SellerForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!form.store_name || !form.phone) {
            toast.error("Store name and phone are required");
            return;
        }

        try {
            setLoading(true);

            await apiPost<SellerForm, any>(
                client,
                "/sellers/become",
                form
            );

            toast.success("Request sent! Waiting for approval 🎉");
            router.push("/");
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 ">
            <Card className="w-full max-w-xl shadow-lg border border-border py-10">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl">
                        Become a Seller
                    </CardTitle>
                    <CardDescription>
                        Create your store and start selling books on our platform
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <FloatingInput
                        label="Store Name"
                        value={form.store_name}
                        onChange={(val) =>
                            handleChange("store_name", val)
                        }
                    />

                    <FloatingInput
                        label="Description"
                        value={form.store_description}
                        onChange={(val) =>
                            handleChange("store_description", val)
                        }
                    />

                    <FloatingInput
                        label="Store Address"
                        value={form.store_address}
                        onChange={(val) =>
                            handleChange("store_address", val)
                        }
                    />

                    <FloatingInput
                        label="Phone Number"
                        value={form.phone}
                        onChange={(val) =>
                            handleChange("phone", val)
                        }
                    />

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full mt-2"
                    >
                        {loading ? "Submitting..." : "Become Seller"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}