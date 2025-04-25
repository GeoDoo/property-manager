import React from 'react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({ isOpen, onConfirm, onCancel }: DeleteConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      data-testid="delete-confirmation-dialog"
    >
      <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-[#262637] mb-4">Delete Property</h2>
        <p className="text-[#6a6a6a] mb-6">
          Are you sure you want to delete this property? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            data-testid="cancel-delete-button"
            className="px-4 py-2 text-sm font-medium text-[#262637] bg-white border-2 border-[#e5e5e5] rounded-xl hover:border-[#00deb6] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            data-testid="confirm-delete-button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 