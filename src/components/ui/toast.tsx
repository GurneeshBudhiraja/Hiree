"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApplicationContext } from "@/providers/application-context-provider";

export function Toaster() {
  const { error, setError } = useApplicationContext();

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-50 max-w-md"
        >
          <div className="bg-destructive text-white rounded-lg shadow-lg border border-destructive/50 p-4 flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
