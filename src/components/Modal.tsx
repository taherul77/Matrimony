import React, { useRef, useEffect, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 bg-opacity-40">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn"
        aria-modal="true"
        role="dialog"
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {title && <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
