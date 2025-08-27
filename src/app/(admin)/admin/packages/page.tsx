
"use client";
import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import AddPackageForm from "@/components/AddPackageForm";
import EditPackageForm from "@/components/EditPackageForm";

async function getPackages() {
  const res = await fetch("/api/packages", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.packages || [];
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  // Remove form state, move to AddPackageForm
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
    const [editModal, setEditModal] = useState<{ open: boolean; pkg: any | null }>({ open: false, pkg: null });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; pkg: any | null }>({ open: false, pkg: null });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);


  // Handler for AddPackageForm
  const handleAddPackage = async (form: { name: string; price: string; duration: string; features: string }) => {
    setLoading(true);
    setError("");
    setSuccess("");
    const featuresArr = form.features.split(",").map(f => f.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          duration: Number(form.duration),
          features: featuresArr,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add package");
      } else {
        const data = await res.json();
        setPackages([...packages, data.package]);
        setSuccess("Package added successfully!");
        setShowModal(false);
      }
    } catch (err) {
      setError("Failed to add package");
    } finally {
      setLoading(false);
    }
  };

    // Handler for EditPackageForm
    const handleEditPackage = async (form: { name: string; price: string; duration: string; features: string }) => {
      if (!editModal.pkg) return;
      setEditLoading(true);
      setEditError("");
      setEditSuccess("");
      const featuresArr = form.features.split(",").map(f => f.trim()).filter(Boolean);
      try {
        const res = await fetch(`/api/packages/${editModal.pkg.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            price: Number(form.price),
            duration: Number(form.duration),
            features: featuresArr,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          setEditError(data.error || "Failed to update package");
        } else {
          const data = await res.json();
          setPackages(
            packages.map((p: any) => (p.id === editModal.pkg.id ? data.package : p))
          );
          setEditSuccess("Package updated successfully!");
          setEditModal({ open: false, pkg: null });
        }
      } catch (err) {
        setEditError("Failed to update package");
      } finally {
        setEditLoading(false);
      }
    };

    // Handler for Delete
    const handleDeletePackage = async () => {
      if (!deleteModal.pkg) return;
      setDeleteLoading(true);
      setDeleteError("");
      try {
        const res = await fetch(`/api/packages/${deleteModal.pkg.id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const data = await res.json();
          setDeleteError(data.error || "Failed to delete package");
        } else {
          setPackages(packages.filter((p: any) => p.id !== deleteModal.pkg.id));
          setDeleteModal({ open: false, pkg: null });
        }
      } catch (err) {
        setDeleteError("Failed to delete package");
      } finally {
        setDeleteLoading(false);
      }
    };

  return (
    <div className="mx-auto max-w-full py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700 drop-shadow">Manage Packages</h1>
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Duration (days)</th>
              <th className="py-3 px-4 text-left">Features</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">No packages found.</td>
              </tr>
            ) : (
              packages.map((pkg: any) => (
                <tr key={pkg.id} className="border-t hover:bg-blue-50 transition">
                  <td className="py-2 px-4 font-semibold text-blue-900">{pkg.name}</td>
                  <td className="py-2 px-4 text-blue-700">৳{pkg.price}</td>
                  <td className="py-2 px-4">{pkg.duration}</td>
                  <td className="py-2 px-4">
                    <ul className="list-disc pl-5 text-gray-700">
                      {pkg.features.map((f: string) => <li key={f}>{f}</li>)}
                    </ul>
                  </td>
                  <td className="py-2 px-4">
                      <button
                        className="text-blue-600 hover:underline mr-2"
                        onClick={() => setEditModal({ open: true, pkg })}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => setDeleteModal({ open: true, pkg })}
                      >
                        Delete
                      </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-center">
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-8 rounded-lg shadow-lg transition-colors text-lg"
          onClick={() => setShowModal(true)}
        >
          Add New Package
        </button>
      </div>
      {/* Dynamic Modal for Add Package */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Package">
        <AddPackageForm
          onSubmit={handleAddPackage}
          loading={loading}
          error={error}
          success={success}
        />
      </Modal>
        <Modal open={editModal.open} onClose={() => setEditModal({ open: false, pkg: null })} title="Edit Package">
          {editModal.pkg && (
            <EditPackageForm
              initialData={editModal.pkg}
              onSubmit={handleEditPackage}
              loading={editLoading}
              error={editError}
              success={editSuccess}
            />
          )}
        </Modal>

        {/* Modal for Delete Confirmation */}
        <Modal open={deleteModal.open} onClose={() => setDeleteModal({ open: false, pkg: null })} title="Delete Package">
          <div className="text-center p-4">
            <p className="mb-6 text-lg">Are you sure you want to delete <span className="font-bold">{deleteModal.pkg?.name}</span>?</p>
            {deleteError && <div className="text-red-600 mb-2">{deleteError}</div>}
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow"
                onClick={handleDeletePackage}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg shadow"
                onClick={() => setDeleteModal({ open: false, pkg: null })}
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
    </div>
       
      
  );
}
