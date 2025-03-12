"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface CustomerReferenceNumberProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerReferenceNumber({ isOpen, onClose }: CustomerReferenceNumberProps) {
  const [referenceNumber, setReferenceNumber] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would process the reference number
    console.log("Customer reference number:", referenceNumber);
    // Close the modal after submission
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-xl">
        <DialogHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Add Customer Reference Number
          </DialogTitle>
          <DialogDescription>
            Add a reference number to track this verification in your system
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="reference-number" className="text-sm font-medium">
              Reference Number
            </label>
            <Input
              id="reference-number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter customer reference number"
              className="w-full"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This reference number will be included in all API responses and webhook events related to this verification.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Benefits of adding a reference number:</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 ml-5 list-disc">
              <motion.li initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                Track verifications in your system
              </motion.li>
              <motion.li initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                Match webhook events to your customer records
              </motion.li>
              <motion.li initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                Easier reporting and data analysis
              </motion.li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Save Reference Number
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 