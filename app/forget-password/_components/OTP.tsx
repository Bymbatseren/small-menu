"use client";

import React, { useEffect, useRef, useState } from "react";

interface OTPInputGroupProps {
  length?: number;
  onChange?: (otp: string) => void;
  className?: string;
}

export function OTPInputGroup({ length = 6, onChange, className = "" }: OTPInputGroupProps) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    onChange?.(values.join(""));
  }, [values, onChange]);

  useEffect(() => {
    const firstEmpty = values.findIndex((v) => v === "");
    const idx = firstEmpty === -1 ? length - 1 : firstEmpty;
    inputsRef.current[idx]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
    const next = [...values];
    next[i] = val;
    setValues(next);
    if (val && i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === "Backspace") {
      if (values[i]) {
        const next = [...values];
        next[i] = "";
        setValues(next);
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const raw =
      e.clipboardData?.getData("text") ??
      ((window as any).clipboardData ? (window as any).clipboardData.getData("text") : "");
    const paste = raw.replace(/[^0-9]/g, "").slice(0, length);
    if (!paste) return;
    const next = Array(length).fill("");
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    setValues(next);
  };

  return (
    <div className={`flex gap-2 ${className}`} onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={values[i]}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          aria-label={`OTP digit ${i + 1}`}
          className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-gray-700/70  text-center text-lg focus:outline-none focus:ring-2  focus:ring-blue-500"
        />
      ))}
    </div>
  );
}
