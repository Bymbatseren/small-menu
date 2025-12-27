"use client";

import { getTables, addTable } from "@/app/actions/table";
import TableCard from "@/app/components/TableCard";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export default function TablesPage() {
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTableName, setNewTableName] = useState("");
    const [adding, setAdding] = useState(false);

    const fetchTables = async () => {
     
        const res = await getTables();
        setTables(res);
        setLoading(false);
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTableName.trim()) return;
        setAdding(true);
        await addTable(newTableName);
        setNewTableName("");
        setAdding(false);
        fetchTables(); 
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Tables</h1>
                    <p className="text-gray-400">Manage your tables and QR codes</p>
                </div>
            </div>

        
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 max-w-xl">
                <h2 className="text-lg font-bold text-white mb-4">Add New Table</h2>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        value={newTableName}
                        onChange={(e) => setNewTableName(e.target.value)}
                        placeholder="Table Name (e.g. Table 5)"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
                    />
                    <button
                        type="submit"
                        disabled={adding || !newTableName.trim()}
                        className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition disabled:opacity-50 flex items-center gap-2"
                    >
                        <Plus size={20} /> Add
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-white text-center py-12">Loading tables...</div>
            ) : tables.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No tables found. Add one above.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tables.map((table) => (
                        <TableCard key={table._id} table={table} />
                    ))}
                </div>
            )}
        </div>
    );
}
