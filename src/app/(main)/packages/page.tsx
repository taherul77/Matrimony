"use client";
import React, { useEffect, useState } from "react";

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        if (!res.ok) throw new Error("Failed to fetch packages");
        const data = await res.json();
        setPackages(data.packages || []);
      } catch (err) {
        setError("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen ">
      {/* Top Banner */}
      <div className="relative w-full h-72 md:h-96 flex items-center justify-center bg-gradient-to-r from-pink-100 via-purple-50 to-pink-100 shadow-lg mb-10 rounded-b-3xl overflow-hidden">
        <img
          src="/globe.svg"
          alt="Banner Globe"
          className="absolute right-8 bottom-0 w-40 h-40 opacity-20 hidden md:block"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-black drop-shadow-lg mb-2">
            Our Packages
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            Choose the best plan for your journey
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-lg text-gray-500 animate-pulse">
              Loading...
            </span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center font-semibold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 py-5">
            {packages.map((pkg: any) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl border-t-4 border-blue-500"
              >
                <h2 className="text-2xl font-bold text-blue-700 mb-2 tracking-wide">
                  {pkg.name}
                </h2>

                <span className="text-sm text-gray-500 mb-1">
                  Duration:{" "}
                  <span className="font-semibold text-blue-600">
                    {pkg.duration} days
                  </span>
                </span>
                <ul className="list-disc pl-5 text-gray-700">
                  {pkg.features.map((f: string) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <span className="text-3xl font-extrabold text-purple-600 mb-2">
                  ৳{pkg.price}
                </span>
                <button className="mt-auto px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all">
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
