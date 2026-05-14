import { useState } from 'react';
import Modal from 'react-modal';

interface CleanupModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: (retentionDays: number) => void;
}

function CleanupModal({ isOpen, onRequestClose, onConfirm }: CleanupModalProps) {
  const [retentionDays, setRetentionDays] = useState(30);

  const handleConfirm = () => {
    onConfirm(retentionDays);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cleanup Modal"
      className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-lg mx-4 shadow-xl border border-gray-700"
      overlayClassName="fixed inset-0 z-[70] flex items-center justify-center bg-black/60"
    >
      <h2 className="text-2xl font-bold mb-4">Clean up builds</h2>
      <div className="mt-4">
        <p className="mb-4">
          This will permanently delete all builds and their associated sessions and logs older than
          the selected retention period.
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="retention-days" className="block text-sm font-medium text-gray-300">
          Retention period (days)
        </label>
        <input
          type="number"
          id="retention-days"
          value={retentionDays}
          onChange={(e) => setRetentionDays(parseInt(e.target.value, 10))}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          onClick={onRequestClose}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}

export default CleanupModal;
