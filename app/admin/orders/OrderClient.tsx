"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { useRouter, useSearchParams } from "next/navigation";
import OrderCard from "@/app/components/OrderCard";
import { getOrders } from "@/app/actions/order";
import { getTables } from "@/app/actions/table";
import { Order, OrderStatus, Table } from "@/types";

const tabs = [
  { id: "PENDING", label: "Pending" },
  { id: "IN_PROGRESS", label: "In Kitchen" },
  { id: "DONE", label: "Done" },
] as const;

type TabStatus = typeof tabs[number]["id"];

export default function OrdersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TabStatus>("PENDING");

  const prevCounts = useRef<Record<string, number>>({});

  
const selectedTable: string | null =
  searchParams?.get("table") ?? null;

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [o, t] = await Promise.all([getOrders(), getTables()]);
      if (!mounted) return;

      setOrders(o);
      setTables(t);
      setLoading(false);

      if (!searchParams?.get("table") && t[0]) {
        router.replace(`/admin/orders?table=${t[0].tableCode}`, {
          scroll: false,
        });
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

useEffect(() => { const initSocket = async () =>
   { await fetch("/api/socket/init"); const socket: Socket = io({ path: "/api/socket/io" });
    socket.on("new-order", async (data: { _id: string }) => { const res = await fetch(`/api/order/${data._id}`);
     if (!res.ok) return; const order = await res.json(); setOrders(prev => [order, ...prev]); });
      return () => socket.disconnect(); };
       initSocket(); }, 
       []);


  const handleOrderStatusChange = (id: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o =>
        o._id === id
          ? {
              ...o,
              status,
              completedAt:
                status === "DONE" ? new Date().toISOString() : o.completedAt,
            }
          : o
      )
    );
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(
      o => o.status === filter && o.tableCode === selectedTable
    );
  }, [orders, filter, selectedTable]);

  const getTableOrderCount = (code: string) =>
    orders.filter(o => o.tableCode === code && o.status !== "DONE").length;

  return (
    <div className="min-h-screen text-white">
   
      <div className=" top-0 z-50 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 md:flex md:justify-between md:items-center">
          <h1 className="text-3xl font-bold">Orders</h1>

          <div className="flex mt-2 md:mt-0 gap-2">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === t.id
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLES */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-3 overflow-x-auto pb-3">
          {tables.map(table => {
            const count = getTableOrderCount(table.tableCode);
            const prev = prevCounts.current[table.tableCode] ?? count;
            const pulse = count !== prev;
            prevCounts.current[table.tableCode] = count;

            const isActive = selectedTable === table.tableCode;

            return (
              <motion.div
                key={table._id}
                layout="position"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                onClick={() =>
                  router.replace(
                    `/admin/orders?table=${table.tableCode}`,
                    { scroll: false }
                  )
                }
                className="relative cursor-pointer min-w-[110px]"
              >
                <div
                  className={`relative rounded-xl p-4 text-center ${
                    isActive
                      ? "text-black"
                      : "bg-white/5 border border-white/10 text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTable"
                      className="absolute inset-0 rounded-xl bg-white"
                      transition={{
                        type: "spring",
                        stiffness: 600,
                        damping: 40,
                      }}
                    />
                  )}

                  <div className="relative z-10 font-bold">
                    {table.name}
                  </div>
                  <div className="relative z-10 text-xs opacity-60">
                    {table.tableCode}
                  </div>

                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={pulse ? { scale: 1.25 } : false}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                      }}
                      className="absolute top-0 -right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold"
                    >
                      {count}
                    </motion.span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter + selectedTable}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredOrders.length ? (
                filteredOrders.map(order => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onStatusChange={handleOrderStatusChange}
                    showCompletedTime={filter === "DONE"}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-slate-400 py-20">
                  No orders
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
