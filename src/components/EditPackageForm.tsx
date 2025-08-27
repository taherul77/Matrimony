import React, { useState, useEffect } from "react";

interface EditPackageFormProps {
  initialData: { name: string; price: number; duration: number; features: string[] };
  onSubmit: (data: { name: string; price: string; duration: string; features: string }) => Promise<void>;
  loading: boolean;
  error: string;
  success: string;
}

const EditPackageForm: React.FC<EditPackageFormProps> = ({ initialData, onSubmit, loading, error, success }) => {
  const [form, setForm] = useState({
    name: initialData.name || "",
    price: initialData.price.toString() || "",
    duration: initialData.duration.toString() || "",
    features: initialData.features.join(", ") || "",
  });

  useEffect(() => {
    setForm({
      name: initialData.name || "",
      price: initialData.price.toString() || "",
      duration: initialData.duration.toString() || "",
      features: initialData.features.join(", ") || "",
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-blue-400"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Price</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-blue-400"
          required
          min={0}
          step="0.01"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Duration (days)</label>
        <input
          type="number"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-blue-400"
          required
          min={1}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Features (comma separated)</label>
        <textarea
          name="features"
          value={form.features}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-blue-400"
          required
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow w-full text-lg"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Package"}
      </button>
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
      {success && <div className="text-green-600 text-center mt-4">{success}</div>}
    </form>
  );
};

export default EditPackageForm;
