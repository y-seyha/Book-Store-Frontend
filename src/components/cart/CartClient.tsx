"use client";

import React, { useState } from "react";
import OrderSummary from "@/components/cart/OrderSummary";
import PaymentSummary from "@/components/cart/PaymentSummary";
import MainLayout from "@/components/layout/MainLayout";
import ShippingForm, { ShippingData } from "@/components/cart/ShippingForm";

export default function CartClient() {
    const [step, setStep] = useState(1);
    const [shippingData, setShippingData] =
        useState<ShippingData | null>(null);

    return (
        <MainLayout>
            <section className="mt-10 max-w-7xl mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row gap-8">

                    <div className="flex-1 space-y-6">
                        <OrderSummary />

                        {step === 1 && (
                            <ShippingForm
                                onSubmit={(data) => {
                                    setShippingData(data);
                                    setStep(2);
                                }}
                            />
                        )}
                    </div>

                    <div className="flex-1">
                        {step === 1 && (
                            <div className="border p-6 text-gray-500 rounded-lg">
                                Fill shipping info to continue
                            </div>
                        )}

                        {step === 2 && shippingData && (
                            <PaymentSummary shippingData={shippingData} />
                        )}
                    </div>

                </div>
            </section>
        </MainLayout>
    );
}