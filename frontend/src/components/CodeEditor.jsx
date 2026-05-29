export default function CodeEditor({ value, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-700 mb-1">
        정해 코드 (Python) <span className="text-red-500">*</span>
      </h2>
      <p className="text-xs text-slate-400 mb-3">
        각 테스트케이스의 stdin을 받아 stdout을 생성하는 정해 파이썬 스크립트를 입력하세요.
      </p>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={14}
        spellCheck={false}
        placeholder={`import sys\n\ndata = sys.stdin.read().split()\n# 정해 코드 작성...`}
        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-slate-50"
      />
    </div>
  );
}
