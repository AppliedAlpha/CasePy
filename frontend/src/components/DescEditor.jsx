export default function DescEditor({ value, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-700 mb-1">문제 설명</h2>
      <p className="text-xs text-slate-400 mb-3">
        ZIP에 포함될 문제 지문/본문을 입력하세요. ({'{'}problem_id{'}'}.txt 로 저장됩니다)
      </p>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={6}
        placeholder="N개의 정수가 주어졌을 때 오름차순으로 정렬하여 출력하시오..."
        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
      />
    </div>
  );
}
