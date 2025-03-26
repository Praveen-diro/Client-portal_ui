"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { CopyToProductionModal } from "../ui/copy-to-production-modal";
import { toast } from "../ui/use-toast";

export function CopyToProductionExample() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDismiss = () => {
    setShowModal(false);
  };

  const copyToProduction = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success!",
        description: "Item has been copied to production.",
        variant: "success",
      });
      setShowModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to production.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
        Copy to Production
      </Button>

      <CopyToProductionModal isOpen={showModal} onClose={onDismiss} onConfirm={copyToProduction} isLoading={isLoading} />
    </div>
  );
}
