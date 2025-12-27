import { Suspense } from "react";
import OrdersClient  from "./OrderClient";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading orders...</div>}>
      <OrdersClient  />
    </Suspense>
  );
}
