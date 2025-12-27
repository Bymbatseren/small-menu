"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import OrderCard from "@/app/components/OrderCard";
import { getOrders } from "@/app/actions/order";
import { getTables } from "@/app/actions/table";

interface OrderType {
  _id: string;
  tableCode: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  total: number;
  items: any[];
  completedAt?: string;
}

interface TableType {
  _id: string;
  name: string;
  tableCode: string;
} 

const tabs = [
  { id: "PENDING", label: "Pending" },
  { id: "IN_PROGRESS", label: "In Kitchen" },
  { id: "DONE", label: "Done" },
] as const;

type TabStatus = typeof tabs[number]["id"];

export default function OrdersClient() {
  const searchParams = useSearchParams();
  const selectedTable = searchParams?.get("table");

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TabStatus>("PENDING");

  /* 🔥 badge pulse detection */
  const prevCounts = useRef<Record<string, number>>({});

  useEffect(() => {
    const init = async () => {
      const [o, t] = await Promise.all([getOrders(), getTables()]);
      setOrders(o);
      setTables(t);
      setLoading(false);
    };
    init();
  }, []);

  /* 🔥 realtime socket */
  useEffect(() => {
    const initSocket = async () => {
      await fetch("/api/socket/init");
      const socket: Socket = io({ path: "/api/socket/io" });

      socket.on("new-order", async (data: { _id: string }) => {
        const res = await fetch(`/api/order/${data._id}`);
        if (!res.ok) return;
        const order = await res.json();
        setOrders(prev => [order, ...prev]);
      });

      return () => socket.disconnect();
    };
    initSocket();
  }, []);

  /* 🔥 status realtime update */
  const handleOrderStatusChange = (
    orderId: string,
    newStatus: OrderType["status"]
  ) => {
    setOrders(prev =>
      prev.map(o =>
        o._id === orderId
          ? {
            ...o,
            status: newStatus,
            completedAt:
              newStatus === "DONE"
                ? new Date().toISOString()
                : o.completedAt,
          }
          : o
      )
    );
  };

  const filteredOrders = orders.filter(o => {
    const tableMatch = selectedTable ? o.tableCode === selectedTable : true;
    return tableMatch && o.status === filter;
  });

  const getTableOrderCount = (tableCode: string) =>
    orders.filter(
      o => o.tableCode === tableCode && o.status !== "DONE"
    ).length;

  return (
    <div className="min-h-screen p-6 text-white space-y-8">

      {/* HEADER */}
      <h1 className="text-3xl font-bold">Orders</h1>

      {/* TABLE FILTER */}
      {/* TABLE FILTER */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map(table => {
          const count = getTableOrderCount(table.tableCode);
          const prev = prevCounts.current[table.tableCode] ?? count;
          const pulse = count !== prev;
          prevCounts.current[table.tableCode] = count;

          const isActive = selectedTable === table.tableCode;

          return (
            <Link
              key={table._id}
              href={`/admin/orders?table=${table.tableCode}`}
              className={`relative rounded-xl p-4 text-center transition
          ${isActive
                  ? "bg-blue-500 text-white border-blue-400"
                  : "bg-white/5 hover:bg-white/10 border-white/10"}`
              }
            >
              <div className="font-bold">{table.name}</div>

              {count > 0 && (
                <motion.span
                  key={count} 
                  initial={pulse ? { scale: 1.5 } : {}}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -top-2 -right-2 bg-red-500 px-2 py-0.5 rounded-full text-xs font-bold"
                >
                  {count}
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>


      {/* TABS */}
      <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm transition
              ${filter === tab.id
                ? "bg-blue-500 text-white"
                : "text-gray-400 hover:text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredOrders.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusChange={handleOrderStatusChange}
                showCompletedTime={filter === "DONE"}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
