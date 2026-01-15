// src/components/common/Modal.jsx
export default function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-xl">✕</button>
        </div>
        <div className="p-4 flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}