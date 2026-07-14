import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Sparkles } from "lucide-react";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, targetHours: number, color: string, group: string) => void;
}

const COLOR_PRESETS = [
  { value: "#5C6D4C", label: "Moss" },
  { value: "#A68A64", label: "Ochre" },
  { value: "#A9B388", label: "Olive" },
  { value: "#6B705C", label: "Sage" },
  { value: "#C2A878", label: "Clay" },
  { value: "#829399", label: "Slate" },
  { value: "#A0522D", label: "Sienna" },
  { value: "#BC8F8F", label: "Rose" },
  { value: "#D4B285", label: "Sand" },
  { value: "#2D4A3E", label: "Forest" },
  { value: "#5B4031", label: "Bark" },
  { value: "#5F455A", label: "Plum" },
];

export default function AddSubjectModal({ isOpen, onClose, onAdd }: AddSubjectModalProps) {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [targetHours, setTargetHours] = useState<number | "">("");
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0].value);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a subject name.");
      return;
    }

    if (targetHours === "" || targetHours <= 0) {
      setError("Please enter a valid study target (greater than 0 hours).");
      return;
    }

    if (targetHours > 40) {
      setError("40 hours per week is the maximum target to prevent burnout. Take care!");
      return;
    }

    onAdd(name.trim(), Number(targetHours), selectedColor, group.trim() || "General");
    setName("");
    setGroup("");
    setTargetHours("");
    setSelectedColor(COLOR_PRESETS[0].value);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#3D4035]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            id="modal-backdrop"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-[#E9E4D8] shadow-xl max-w-md w-full p-6 relative overflow-hidden"
              id="add-subject-modal"
            >
              {/* Decorative top header accent */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300" 
                style={{ backgroundColor: selectedColor }}
              />

              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-serif italic text-[#3D4035] font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5" style={{ color: selectedColor }} />
                  Add New Subject
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-[#8A8F7C] hover:text-[#3D4035] hover:bg-[#F5F2EA] transition-colors"
                  id="close-subject-modal-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-100 font-bold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject-name" className="block text-[10px] font-bold text-[#6B705C] mb-1.5 uppercase tracking-wider">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    id="subject-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Distributed Systems, Organic Chemistry"
                    className="w-full px-3.5 py-2.5 border border-[#E9E4D8] rounded-xl text-[#3D4035] bg-[#F5F2EA]/40 focus:outline-hidden focus:ring-2 focus:ring-[#5C6D4C]/15 focus:border-[#5C6D4C] transition-colors placeholder:text-[#8A8F7C] font-semibold text-xs"
                    maxLength={40}
                  />
                </div>

                <div>
                  <label htmlFor="subject-group" className="block text-[10px] font-bold text-[#6B705C] mb-1.5 uppercase tracking-wider">
                    Subject Group / Category (Optional)
                  </label>
                  <input
                    type="text"
                    id="subject-group"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    placeholder="e.g. Computer Science, Mathematics, Humanities, Electives"
                    className="w-full px-3.5 py-2.5 border border-[#E9E4D8] rounded-xl text-[#3D4035] bg-[#F5F2EA]/40 focus:outline-hidden focus:ring-2 focus:ring-[#5C6D4C]/15 focus:border-[#5C6D4C] transition-colors placeholder:text-[#8A8F7C] font-semibold text-xs"
                    maxLength={25}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {["Computer Science", "Mathematics", "Design", "Electives"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setGroup(cat)}
                        className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          group === cat
                            ? "bg-[#5C6D4C] text-white border-[#5C6D4C]"
                            : "bg-white text-[#6B705C] border-[#E9E4D8] hover:border-[#5C6D4C]/40 dark:bg-natural-fill"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="target-hours" className="block text-[10px] font-bold text-[#6B705C] mb-1.5 uppercase tracking-wider">
                    Weekly Goal (Hours)
                  </label>
                  <input
                    type="number"
                    id="target-hours"
                    value={targetHours}
                    onChange={(e) => setTargetHours(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 5, 8"
                    className="w-full px-3.5 py-2.5 border border-[#E9E4D8] rounded-xl text-[#3D4035] bg-[#F5F2EA]/40 focus:outline-hidden focus:ring-2 focus:ring-[#5C6D4C]/15 focus:border-[#5C6D4C] transition-colors placeholder:text-[#8A8F7C] font-semibold text-xs"
                    min="1"
                    max="40"
                  />
                  <p className="text-[10px] text-[#8A8F7C] mt-1.5 font-medium leading-relaxed">
                    Enter the targeted number of study hours per week.
                  </p>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-[#6B705C] mb-2 uppercase tracking-wider">
                    Visual Accent Color
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                          selectedColor === color.value
                            ? "border-[#5C6D4C] bg-[#F5F2EA] text-[#3D4035] shadow-2xs"
                            : "border-[#E9E4D8] hover:border-[#5C6D4C]/60 bg-[#FDFCF9] text-[#8A8F7C]"
                        }`}
                        id={`color-btn-${color.label.toLowerCase()}`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/5"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-[9px] font-bold tracking-wider">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-[#E9E4D8] text-[#6B705C] bg-[#F5F2EA] rounded-xl font-bold hover:bg-[#E9E4D8]/50 transition-colors text-xs"
                    id="cancel-subject-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 text-white rounded-xl font-bold shadow-sm hover:brightness-105 transition-all text-xs flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: selectedColor }}
                    id="submit-subject-btn"
                  >
                    <Plus className="w-4 h-4" />
                    Add Subject
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
