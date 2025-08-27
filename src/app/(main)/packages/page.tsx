
import React from "react";


import { cookies } from "next/headers";

async function getPackages() {
  // Use absolute URL for SSR fetch
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || "http://localhost:3000";
  const url = base.startsWith("http") ? `${base}/api/packages` : `https://${base}/api/packages`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Cookie: cookies().toString() },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.packages || [];
}

export default async function PackagesPage() {
  const packages = await getPackages();
  return (
    <div className="mx-auto max-w-5xl py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">Membership Packages</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {packages.map((pkg: any) => (
          <div
            key={pkg.id}
            className="rounded-xl shadow-lg bg-white p-6 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition-shadow duration-200"
          >
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">{pkg.name}</h2>
            <div className="text-3xl font-bold mb-4 text-gray-800">${pkg.price}</div>
            <div className="mb-4 text-gray-500">{pkg.duration} days</div>
            <ul className="mb-6 text-gray-700 text-left w-full list-disc pl-5">
              {pkg.features.map((f: string) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors w-full">
              Choose {pkg.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
