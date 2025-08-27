import React from "react";

async function getPackages() {
  const res = await fetch("/api/packages", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.packages || [];
}

export default async function AdminPackagesPage() {
  const packages = await getPackages();
  return (
    <div className="mx-auto max-w-4xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Manage Packages</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Duration (days)</th>
              <th className="py-3 px-4 text-left">Features</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg: any) => (
              <tr key={pkg.id} className="border-t">
                <td className="py-2 px-4 font-semibold">{pkg.name}</td>
                <td className="py-2 px-4">${pkg.price}</td>
                <td className="py-2 px-4">{pkg.duration}</td>
                <td className="py-2 px-4">
                  <ul className="list-disc pl-5">
                    {pkg.features.map((f: string) => <li key={f}>{f}</li>)}
                  </ul>
                </td>
                <td className="py-2 px-4">
                  <button className="text-blue-600 hover:underline mr-2">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
          Add New Package
        </button>
      </div>
    </div>
  );
}
