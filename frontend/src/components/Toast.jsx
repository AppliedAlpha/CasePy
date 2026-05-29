import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastCtx = createContext(null);

const CONFIG = {
  success: {
    bar:  'bg-emerald-500',
    wrap: 'bg-white border-emerald-400',
    icon: '✓',
    iconCls: 'bg-emerald-100 text-emerald-600',
    textCls: 'text-slate-700',
  },
  error: {
    bar:  'bg-red-500',
    wrap: 'bg-white border-red-400',
    icon: '✕',
    iconCls: 'bg-red-100 text-red-600',
    textCls: 'text-slate-700',
  },
  warning: {
    bar:  'bg-amber-500',
    wrap: 'bg-white border-amber-400',
    icon: '!',
    iconCls: 'bg-amber-100 text-amber-600',
    textCls: 'text-slate-700',
  },
};

function ToastItem({ toast, onDismiss }) {
  const cfg = CONFIG[toast.type] || CONFIG.success;

  return (
    <div
      className={`
        relative flex items-start gap-3 pl-4 pr-3 py-3
        rounded-xl border shadow-lg w-80 overflow-hidden
        ${cfg.wrap}
        ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
      `}
    >
      {/* 왼쪽 컬러 바 */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${cfg.bar}`} />

      {/* 아이콘 */}
      <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${cfg.iconCls}`}>
        {cfg.icon}
      </span>

      {/* 메시지 */}
      <p className={`flex-1 text-sm leading-snug ${cfg.textCls}`}>
        {toast.message}
      </p>

      {/* 닫기 버튼 */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors text-base leading-none mt-0.5"
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    // 나가는 애니메이션 트리거
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    // 애니메이션 끝난 후 DOM에서 제거 (0.22s + 여유 30ms)
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 250);
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastCtx.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
