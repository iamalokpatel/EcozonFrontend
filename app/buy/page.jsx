"use client";
import React, { Suspense } from "react";
import BuyPage from "./buyPage"; // or inline if you're not splitting

export default function BuyPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyPage />
    </Suspense>
  );
}
