import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout — Unlock Your Full Roof Report",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-stone-500">Loading checkout…</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
