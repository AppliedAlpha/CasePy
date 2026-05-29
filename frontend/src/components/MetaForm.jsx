export default function MetaForm({ problemId, timeLimit, testcaseDir, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-700 mb-4">문제 메타 정보</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">
            Problem ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={problemId}
            onChange={e => onChange('problemId', e.target.value)}
            placeholder="예: prob_binary_search"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600">Time Limit (초)</label>
          <input
            type="number"
            value={timeLimit}
            min="0.1"
            step="0.1"
            onChange={e => onChange('timeLimit', parseFloat(e.target.value) || 1.0)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-1">
            Testcase 폴더명
            <span
              className="cursor-help text-slate-400 text-xs border border-slate-300 rounded-full w-4 h-4 inline-flex items-center justify-center"
              title="비워두면 자동으로 'Case' 폴더로 지정됩니다."
            >
              ?
            </span>
          </label>
          <input
            type="text"
            value={testcaseDir}
            onChange={e => onChange('testcaseDir', e.target.value)}
            placeholder="기본값: Case"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
          <p className="text-xs text-slate-400">비우면 &apos;Case&apos; 폴더로 자동 지정됩니다.</p>
        </div>

      </div>
    </div>
  );
}
