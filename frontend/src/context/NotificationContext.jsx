// src/context/NotificationContext.jsx
import { createContext, useState, useContext } from "react";

// ESTILS
const TOAST = "fixed bottom-5 right-5 px-6 py-3 rounded shadow-2xl z-[9999] text-xs font-bold uppercase tracking-widest transition-all duration-500 transform border";
const OVERLAY = "fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-[10000]";
const BOX = "bg-white border border-gray-200 p-6 rounded-lg shadow-xl text-center max-w-xs";
const BTN_OK = "bg-gray-900 text-white px-4 py-2 rounded text-[10px] font-bold uppercase hover:bg-black";
const BTN_NO = "px-4 py-2 text-[10px] font-bold text-gray-400 uppercase hover:text-black";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [msg, setMsg] = useState(null);
  const [isErr, setIsErr] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const notify = (text, err = false) => {
    setMsg(text); setIsErr(err);
    setTimeout(() => setMsg(null), 3000);
  };

  const ask = () => new Promise(res => setConfirm({ res }));

  return (
    <NotificationContext.Provider value={{ notify, ask }}>
      {children}
      {/* NOTIFICACIÓ */}
      <div className={`${TOAST} ${msg ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${isErr ? 'bg-white text-red-600 border-red-100' : 'bg-gray-900 text-white border-transparent'}`}>
        {msg}
      </div>
      {/* CONFIRMACIÓ SIMPLE (NOMÉS DELETES) */}
      {confirm && (
        <div className={OVERLAY}>
          <div className={BOX}>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-4">Are you sure you want to proceed?</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => { confirm.res(false); setConfirm(null); }} className={BTN_NO}>No</button>
              <button onClick={() => { confirm.res(true); setConfirm(null); }} className={BTN_OK}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
export const useNotify = () => useContext(NotificationContext);