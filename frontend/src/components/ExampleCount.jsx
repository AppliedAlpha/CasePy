const OPTIONS = [0, 1, 2, 3];

export default function ExampleCount({ value, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-700 mb-1">입력 / 출력 예시 지문 출력 개수</h2>
      <p className="text-xs text-slate-400 mb-3">
        선택한 개수만큼, 앞쪽 테스트케이스의 stdin / stdout이 문제 지문(.txt) 끝에 입출력 예시로 추가됩니다.
      </p>
      <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden">
        {OPTIONS.map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`px-5 py-2 text-sm font-medium border-r border-slate-300 last:border-r-0 transition-colors ${
              value === n
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
