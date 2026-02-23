"use client";
import React, { useEffect, useState } from "react";
import { AddItemForm } from "../dashboard/market/types";

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: AddItemForm) => void;
}

const EMPTY: AddItemForm = {
  name: "",
  description: "",
  price: "",
  sellerName: "",
  condition: "Good",
  location: "",
  category: "",
  image: null,
};

export default function AddItemModal({
  open,
  onClose,
  onSubmit,
}: AddItemModalProps) {
  const [form, setForm] = useState<AddItemForm>(EMPTY);
  const [errors, setErrors] = useState<Partial<AddItemForm>>({});

  useEffect(() => {
    setForm(EMPTY);
    setErrors({});
  }, [open]);

  const validate = (): boolean => {
    const e: Partial<AddItemForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    if (!form.sellerName.trim()) e.sellerName = "Your name is required";
    if (!form.location.trim()) e.location = "College / location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5 pb-24"
      style={{ background: "rgba(30,10,60,0.5)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-95 rounded-3xl flex flex-col"
        style={{
          background: "linear-gradient(160deg,#f5f3ff 0%,#fff 60%)",
          boxShadow: "0 16px 60px rgba(109,40,217,0.22)",
          animation: "popIn 0.26s cubic-bezier(.34,1.56,.64,1)",
          maxHeight: "88vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header – sticky */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4 shrink-0">
          <h2 className="text-lg font-extrabold text-violet-900">
            Add New Item
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "#ede9fe", color: "#7c3aed" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* Scrollable form body */}
        <div
          className="overflow-y-auto px-5 pb-6"
          style={{ scrollbarWidth: "none" }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Item Name */}
            <div>
              <label className="text-xs font-semibold text-violet-600 mb-1 block">
                Item Name
              </label>
              <input
                type="text"
                placeholder="e.g. Vintage Camera"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium outline-none transition-colors"
                style={{
                  borderColor: errors.name ? "#fca5a5" : "#ddd6fe",
                  background: "#faf5ff",
                  color: "#1e1b4b",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.name
                    ? "#fca5a5"
                    : "#ddd6fe")
                }
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-violet-600 mb-1 block">
                Description
              </label>
              <textarea
                placeholder="Short description of the item…"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium outline-none resize-none transition-colors"
                style={{
                  borderColor: errors.description ? "#fca5a5" : "#ddd6fe",
                  background: "#faf5ff",
                  color: "#1e1b4b",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.description
                    ? "#fca5a5"
                    : "#ddd6fe")
                }
              />
              {errors.description && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold text-violet-600 mb-1 block">
                Price (रु)
              </label>
              <input
                type="number"
                placeholder="e.g. 499"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium outline-none transition-colors"
                style={{
                  borderColor: errors.price ? "#fca5a5" : "#ddd6fe",
                  background: "#faf5ff",
                  color: "#1e1b4b",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.price
                    ? "#fca5a5"
                    : "#ddd6fe")
                }
              />
              {errors.price && (
                <p className="text-xs text-red-400 mt-1">{errors.price}</p>
              )}
            </div>

            {/* Extra fields – seller name, condition, location */}
            <div className="flex flex-col gap-4">
              {/* Seller Name */}
              <div>
                <label className="text-xs font-semibold text-violet-600 mb-1 block">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={form.sellerName}
                  onChange={(e) =>
                    setForm({ ...form, sellerName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium outline-none transition-colors"
                  style={{
                    borderColor: errors.sellerName ? "#fca5a5" : "#ddd6fe",
                    background: "#faf5ff",
                    color: "#1e1b4b",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.sellerName
                      ? "#fca5a5"
                      : "#ddd6fe")
                  }
                />
                {errors.sellerName && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.sellerName}
                  </p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label className="text-xs font-semibold text-violet-600 mb-1 block">
                  Condition
                </label>
                <select
                  value={form.condition}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      condition: e.target.value as AddItemForm["condition"],
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium outline-none transition-colors appearance-none"
                  style={{
                    borderColor: "#ddd6fe",
                    background: "#faf5ff",
                    color: "#1e1b4b",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")}
                >
                  {["New", "Like New", "Good", "Fair", "Poor"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location / College */}
              <div>
                <label className="text-xs font-semibold text-violet-600 mb-1 block">
                  College / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. IIT Bombay or Mumbai, MH"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium outline-none transition-colors"
                  style={{
                    borderColor: errors.location ? "#fca5a5" : "#ddd6fe",
                    background: "#faf5ff",
                    color: "#1e1b4b",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.location
                      ? "#fca5a5"
                      : "#ddd6fe")
                  }
                />
                {errors.location && (
                  <p className="text-xs text-red-400 mt-1">{errors.location}</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-violet-600 mb-1 block">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as AddItemForm["category"],
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border-2 text-sm font-medium outline-none transition-colors appearance-none"
                style={{
                  borderColor: "#ddd6fe",
                  background: "#faf5ff",
                  color: form.category ? "#1e1b4b" : "#9ca3af",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd6fe")}
              >
                <option value="">Select a category (optional)</option>
                {[
                  "Electronics",
                  "Clothing",
                  "Books",
                  "Stationery",
                  "Furniture",
                  "Sports",
                  "Food",
                  "Other",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-xs font-semibold text-violet-600 mb-1 block">
                Photo (optional, max 5 MB)
              </label>
              <label
                className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl border-2 cursor-pointer transition-colors"
                style={{ borderColor: "#ddd6fe", background: "#faf5ff" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm font-medium" style={{ color: form.image ? "#1e1b4b" : "#9ca3af" }}>
                  {form.image ? form.image.name : "Choose image…"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.files?.[0] ?? null })
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-extrabold text-white text-base active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#6d28d9)",
                boxShadow: "0 6px 20px rgba(109,40,217,0.4)",
              }}
            >
              Add to Marketplace
            </button>
          </form>
        </div>{" "}
        {/* end scrollable */}
      </div>{" "}
      {/* end card */}
      <style jsx global>{`
        @keyframes popIn {
          from {
            transform: scale(0.88);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
