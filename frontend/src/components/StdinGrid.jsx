const ERROR_LABEL = {
  RuntimeError: 'RuntimeError',
  TimeLimitExceeded: 'TLE',
};

function ResultBox({ result }) {
  if (!result) {
    return (
      <div className="flex-1 min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-400 min-h-[96px] flex items-center justify-center">
        미리 실행 전
      </div>
    );
  }

  if (result.success) {
    return (
      <div className="flex-1 min-w-0 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-mono text-emerald-800 min-h-[96px] whitespace-pre-wrap break-all overflow-auto max-h-48">
        {result.stdout || <span className="text-emerald-400 italic">(출력 없음)</span>}
      </div>
    );
  }

  const label = ERROR_LABEL[result.error_type] || result.error_type;
  return (
    <div className="flex-1 min-w-0 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-mono text-red-700 min-h-[96px] overflow-auto max-h-48">
      <span className="inline-block mb-1 font-semibold bg-red-100 text-red-600 rounded px-1.5 py-0.5 text-[10px]">
        {label}
      </span>
      <pre className="whitespace-pre-wrap break-all mt-1">
        {result.stderr || result.stdout || '알 수 없는 오류'}
      </pre>
    </div>
  );
}

export default function StdinGrid({ testCases, previewResults, onChange }) {
  function addCase() {
    onChange([...testCases, '']);
  }

  function removeCase(idx) {
    if (testCases.length === 1) return;
    onChange(testCases.filter((_, i) => i !== idx));
  }

  function updateCase(idx, value) {
    const next = [...testCases];
    next[idx] = value;
    onChange(next);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-700">표준 입력 / 출력 미리보기</h2>
        <button
          type="button"
          onClick={addCase}
          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
        >
          <span className="text-lg leading-none">+</span> 케이스 추가
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-2 mb-2 px-9">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">stdin</span>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">stdout</span>
      </div>

      <div className="flex flex-col gap-3">
        {testCases.map((tc, idx) => {
          const result = previewResults ? previewResults[idx] : null;
          return (
            <div key={idx} className="flex gap-2 items-start">
              <span className="mt-2 w-7 text-center text-sm font-mono font-semibold text-slate-400 shrink-0">
                #{idx + 1}
              </span>

              <textarea
                value={tc}
                onChange={e => updateCase(idx, e.target.value)}
                rows={4}
                placeholder={`테스트케이스 ${idx + 1}번 stdin...`}
                className="flex-1 min-w-0 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />

              <ResultBox result={result} />

              <button
                type="button"
                onClick={() => removeCase(idx)}
                disabled={testCases.length === 1}
                className="mt-2 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                title="삭제"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
