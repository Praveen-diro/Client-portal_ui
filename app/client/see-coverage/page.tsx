"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function SeeCoverage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Coverage Report</h1>
     
    </div>
  );
}
