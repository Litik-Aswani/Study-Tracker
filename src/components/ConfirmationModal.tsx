import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  onConfirm,
  onClose,
}: ConfirmationModalProps) {
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
            id="confirm-backdrop"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-natural-card rounded-3xl border border-natural-border shadow-xl max-w-sm w-full p-6 relative overflow-hidden"
              id="confirm-dialog"
            >
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-2xl shrink-0 ${isDanger ? 'bg-rose-500/10 text-rose-600' : 'bg-natural-fill text-natural-primary'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base font-serif italic text-natural-text font-bold">
                    {title}
                  </h3>
                  <p className="text-xs text-natural-dark-muted leading-relaxed font-medium">
                    {message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-5 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-natural-border text-natural-dark-muted bg-natural-fill rounded-xl font-bold hover:bg-natural-border/50 transition-colors text-xs cursor-pointer"
                  id="confirm-cancel-btn"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-4 py-2 text-white rounded-xl font-bold transition-all text-xs cursor-pointer ${
                    isDanger 
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-sm' 
                      : 'bg-natural-primary hover:bg-natural-primary-dark shadow-sm'
                  }`}
                  id="confirm-confirm-btn"
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
