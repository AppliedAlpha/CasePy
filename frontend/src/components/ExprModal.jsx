import { useState, useEffect, useCallback } from 'react';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// {{A~B:d}}  → randint [A, B]
// {{A~B:Xf}} → randfloat [A, B], X decimal places
// {{*:Xs}}   → random alphanumeric string of length X
const EXPR_RE = /\{\{(-?[\d.]+)~(-?[\d.]+):(\d+)f\}\}|\{\{(-?[\d.]+)~(-?[\d.]+):d\}\}|\{\{\*:(\d+)s\}\}/g;

function randInt(a, b) {
  const lo = Math.ceil(Math.min(a, b));
  const hi = Math.floor(Math.max(a, b));
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function randFloat(a, b, decimals) {
  const v = Math.random() * (b - a) + a;
  return v.toFixed(decimals);
}

function randStr(len) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return s;
}

export function resolveExpr(raw) {
  // \n 이스케이프 → 실제 줄바꿈
  const text = raw.replace(/\\n/g, '\n');

  return text.replace(EXPR_RE, (match, ff_a, ff_b, ff_dec, di_a, di_b, str_len) => {
    if (ff_dec !== undefined) {
      // randfloat: {{A~B:Xf}}
      return randFloat(parseFloat(ff_a), parseFloat(ff_b), parseInt(ff_dec, 10));
    }
    if (di_a !== undefined) {
      // randint: {{A~B:d}}
      return randInt(parseFloat(di_a), parseFloat(di_b));
    }
    if (str_len !== undefined) {
      // randstr: {{*:Xs}}
      return randStr(parseInt(str_len, 10));
    }
    return match;
  });
}

export default function ExprModal({ caseIndex, onConfirm, onCancel }) {
  const [expr, setExpr] = useState('');
  const [preview, setPreview] = useState('');

  const refresh = useCallback((raw) => {
    try {
      setPreview(resolveExpr(raw));
    } catch {
      setPreview('(파싱 오류)');
    }
  }, []);

  useEffect(() => {
    refresh(expr);
  }, [expr, refresh]);

  function handleOk() {
    if (!expr.trim()) return;
    onConfirm(resolveExpr(expr));
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onCancel();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleOk();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">
            입력 #{caseIndex + 1} — 표현식 입력
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* 바디 */}
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* 표현식 입력 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">표현식</label>
            {/* 구문 힌트 */}
            <div className="flex flex-col gap-0.5 text-xs text-slate-400 font-mono">
              <span><span className="text-indigo-400">{'{{A~B:d}}'}</span>  — 정수 (randint)</span>
              <span><span className="text-indigo-400">{'{{A~B:Xf}}'}</span> — 실수, 소수점 X자리 (randfloat)</span>
              <span><span className="text-indigo-400">{'{{*:Xs}}'}</span>   — 랜덤 문자열, X자리 (A-Z a-z 0-9)</span>
              <span><span className="text-indigo-400">\n 혹은 [Enter]</span>             — 줄바꿈</span>
            </div>
            <textarea
              autoFocus
              value={expr}
              onChange={e => setExpr(e.target.value)}
              rows={5}
              placeholder={
                '5\\n{{1~100:d}} {{1~100:d}} {{1~100:d}}\n\n{{0.0~1.0:4f}}\n\n{{*:6s}}'
              }
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* 미리보기 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-500">미리보기</label>
              <button
                type="button"
                onClick={() => refresh(expr)}
                className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                ↻ 재생성
              </button>
            </div>
            <pre className="min-h-[60px] max-h-40 overflow-auto rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-700 whitespace-pre-wrap break-all">
              {preview || <span className="text-slate-300">표현식을 입력하면 여기에 결과가 표시됩니다.</span>}
            </pre>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleOk}
            disabled={!expr.trim()}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
