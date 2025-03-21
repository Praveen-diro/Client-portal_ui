"use client";

import { Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { ConfirmationModal, ConfirmationModalProps } from "./confirmation-modal";

export interface DeleteModalProps extends Omit<ConfirmationModalProps, "variant"> {
  /**
   * The title of what is being deleted (e.g., "document", "session")
   */
  itemType?: string;
  /**
   * Whether to disable the confirmation animation
   */
  disableAnimation?: boolean;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  icon,
  description,
  cancelText = "Cancel",
  confirmText = "Delete",
  itemDetail,
  isLoading = false,
  itemType = "item",
  disableAnimation = true,
}: DeleteModalProps) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title || `Delete ${itemType}`}
      icon={icon || <Trash2 />}
      description={description || `Are you sure you want to delete this ${itemType}? This action cannot be undone.`}
      cancelText={cancelText}
      confirmText={confirmText}
      itemDetail={itemDetail}
      variant="delete"
      isLoading={isLoading}
      disableAnimation={disableAnimation}
    />
  );
}
