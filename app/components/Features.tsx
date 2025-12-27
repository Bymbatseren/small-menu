"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Smartphone, Globe } from "lucide-react";

const features = [
    {
        title: "Хурдтай",
        description: "Хэрэглэгчдэдээ хүлээлтгүй үйлчилгээг санал болго.",
        icon: Zap,
    },
    {
        title: "Найдвартай",
        description: "Таны дата мэдээлэл найдвартай хадгалагдана.",
        icon: Shield,
    },
    {
        title: "Мобайл",
        description: "Гар утас, таблет, десктоп дээр төгс ажиллана.",
        icon: Smartphone,
    },
    {
        title: "Global",
        description: "Дэлхийн хаанаас ч хандах боломжтой.",
        icon: Globe,
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-gray-50 dark:bg-zinc-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Яагаад биднийг сонгох вэ?
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                        Бид таны бизнесийг дараагийн түвшинд гаргахад тусална.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-4 md:grid-cols-2">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-white/5 shadow-sm ring-1 ring-gray-200 dark:ring-white/10"
                            >
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
                                    <feature.icon className="h-8 w-8" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-semibold leading-7 tracking-tight text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
