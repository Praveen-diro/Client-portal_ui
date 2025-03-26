"use client";

import { useState } from "react";
import Image from "next/image";
import { ConfirmationModal } from "./confirmation-modal";

interface CopyToProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CopyToProductionModal({ isOpen, onClose, onConfirm, isLoading = false }: CopyToProductionModalProps) {
  const customIcon = (
    <div className="flex items-center justify-center w-9 h-9">
      <Image src="/assets/images/copyToProduction.png" alt="Copy to production" width={36} height={36} />
    </div>
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Copy to Production"
      icon={customIcon}
      description="Are you sure you want to copy this button to production?"
      cancelText="Cancel"
      confirmText="Yes"
      variant="info"
      isLoading={isLoading}
    />
  );
}
