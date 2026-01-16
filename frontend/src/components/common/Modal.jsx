// src/components/common/Modal.jsx

// ESTILS
const OVERLAY_STYLE = "fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 backdrop-blur-sm";
const MODAL_BOX = "bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden";
const HEADER_STYLE = "p-5 border-b flex justify-between items-center bg-gray-50";
const TITLE_STYLE = "font-bold text-gray-900 uppercase tracking-widest text-sm";
const CLOSE_BTN = "text-gray-400 hover:text-black text-xl";
const CONTENT_STYLE = "p-4 flex-1 overflow-hidden";

export default function Modal({ title, isOpen, onClose, children }) {
  // SI NO ESTA OBERT NO RENDERITZA RES
  if (!isOpen) return null;

  // RENDERITZAT
  return (
    <div className={OVERLAY_STYLE}>
      <div className={MODAL_BOX}>
        <div className={HEADER_STYLE}>
          <h3 className={TITLE_STYLE}>{title}</h3>
          <button onClick={onClose} className={CLOSE_BTN}>✕</button>
        </div>
        <div className={CONTENT_STYLE}>{children}</div>
      </div>
    </div>
  );
}