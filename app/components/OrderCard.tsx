"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/actions/order";
import { Clock, CheckCircle, ChefHat, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Order, OrderStatus } from "@/types";

interface OrderCardProps {
  order: Order;
  onStatusChange?: (
    orderId: string,
    status: OrderStatus
  ) => void;
  showCompletedTime?: boolean; // ✅ ШИНЭ
}

export default function OrderCard({
  order,
  onStatusChange = () => { },
  showCompletedTime = false,
}: OrderCardProps) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (
    newStatus: OrderStatus
  ) => {
    setLoading(true);

    setCurrentOrder((prev: any) => ({
      ...prev,
      status: newStatus,
      completedAt:
        newStatus === "DONE"
          ? new Date().toISOString()
          : prev.completedAt,
    }));

    onStatusChange(order._id, newStatus);

    try {
      await updateOrderStatus(order._id, newStatus);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: Record<OrderStatus, { color: string; bg: string; border: string; icon: any; label: string }> = {
    PENDING: {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      icon: Clock,
      label: "Pending",
    },
    IN_PROGRESS: {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: ChefHat,
      label: "Cooking",
    },
    DONE: {
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      icon: CheckCircle,
      label: "Completed",
    },
  };

  const status = statusConfig[currentOrder.status];
  const StatusIcon = status.icon;

  return (
    <AnimatePresence>
      {(currentOrder.status !== "DONE" || showCompletedTime) && (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: -20,
            transition: { duration: 0.35, ease: "easeInOut" },
          }}
          className={`relative bg-[#121212] rounded-3xl p-6 border ${status.border} shadow-xl`}
        >
          {/* Glow */}
          <div
            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[70px] opacity-20 ${status.bg.replace(
              "/10",
              ""
            )}`}
          />

          {/* Header */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="font-bold text-xl text-white">
                Table {currentOrder.tableCode}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                {new Date(currentOrder.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <motion.div
              key={currentOrder.status}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-4 py-1.5 rounded-full border ${status.border} ${status.bg} ${status.color}
              text-xs font-bold flex items-center gap-2 uppercase`}
            >
              <StatusIcon size={14} />
              {status.label}
            </motion.div>
          </div>

          {/* ✅ DONE time (design-д халдахгүй) */}
          {showCompletedTime && currentOrder.completedAt && (
            <div className="text-xs text-green-400 mb-3 relative z-10">
              ✅ Completed at{" "}
              {new Date(currentOrder.completedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}

          {/* Items */}
          <div className="space-y-3 mb-8 relative z-10">
            {currentOrder.items.map((orderItem, idx) => {
              const item = typeof orderItem.item === 'string' ? null : orderItem.item;
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm py-2 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3 text-zinc-300">
                    <span className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 text-xs font-bold">
                      {orderItem.quantity}
                    </span>
                    {item?.title || (
                      <span className="italic text-red-400">
                        Deleted Item
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-500 font-mono">
                    {item
                      ? `$${(
                        item.price *
                        orderItem.quantity
                      ).toFixed(2)}`
                      : "-"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5 relative z-10">
            <div>
              <span className="text-xs text-zinc-500 uppercase">
                Total
              </span>
              <p className="text-2xl font-bold text-white">
                ${currentOrder.total.toFixed(2)}
              </p>
            </div>

            <div>
              {currentOrder.status === "PENDING" && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    handleStatusChange(OrderStatus.IN_PROGRESS)
                  }
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500
                  text-white text-sm font-bold flex items-center gap-2"
                >
                  Start <ArrowRight size={16} />
                </motion.button>
              )}

              {currentOrder.status === "IN_PROGRESS" && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatusChange(OrderStatus.DONE)}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500
                  text-white text-sm font-bold flex items-center gap-2"
                >
                  Complete <CheckCircle size={16} />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
