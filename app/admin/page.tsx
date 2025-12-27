"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
const stats = [
  { label: "Today's Revenue", value: "$1,240", icon: DollarSign, color: "from-green-400 to-emerald-600", trend: "+12%" },
  { label: "Active Orders", value: "12", icon: Activity, color: "from-blue-400 to-indigo-600", trend: "+4" },
  { label: "Total Customers", value: "128", icon: Users, color: "from-orange-400 to-pink-600", trend: "+8%" },
];
 const test=async()=>{
  try{
    const res = await fetch("/api/table", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
   name:"Table 1"
  }),
});

const data = await res.json();
console.log(data);
  } catch(error){
    console.log(error)
  }
 }

export default function AdminPage() {
  return (
    <div className="space-y-10">
   
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-zinc-900 to-black border border-white/5 p-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 onClick={test} className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Welcome <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-200">Back!</span>
            </h1>
            <p className="text-zinc-400 max-w-xl text-lg leading-relaxed">
              Your restaurant is running smoothly. Here's what's happening today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 animate-pulse-slow">
              <TrendingUp className="text-white" size={32} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2 }}
              className="bg-[#121212] backdrop-blur-md border border-white/5 p-6 rounded-3xl hover:bg-white/5 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10 opacity-80 group-hover:opacity-100 transition-opacity`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-green-400 text-sm font-bold bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                  {stat.trend}
                </span>
              </div>
              <div>
                <h3 className="text-zinc-500 mb-1 font-medium text-sm uppercase tracking-wider">{stat.label}</h3>
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity or Placeholder Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#121212] rounded-3xl border border-white/5 p-8 min-h-[300px] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-zinc-600 mb-2">
            <Activity size={48} className="mx-auto opacity-20" />
          </div>
          <h3 className="text-zinc-500 font-medium">Activity Chart Visualization</h3>
          <p className="text-zinc-700 text-sm">Waiting for real data...</p>
        </div>
      </motion.div>
    </div>
  );
}
