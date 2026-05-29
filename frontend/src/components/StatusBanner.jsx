const TYPE_STYLE = {
  BadRequest: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  RuntimeError: 'bg-red-50 border-red-300 text-red-800',
  TimeLimitExceeded: 'bg-orange-50 border-orange-300 text-orange-800',
  success: 'bg-green-50 border-green-300 text-green-800',
};

const TYPE_LABEL = {
  BadRequest: '입력 오류',
  RuntimeError: '런타임 에러',
  TimeLimitExceeded: '시간 초과 (TLE)',
  success: '패키지 생성 완료',
};

export default function StatusBanner({ status }) {
  if (!status) return null;

  const style = TYPE_STYLE[status.type] || 'bg-slate-50 border-slate-300 text-slate-800';
  const label = TYPE_LABEL[status.type] || status.type;

  return (
    <div className={`rounded-xl border px-5 py-4 text-sm ${style}`}>
      <p className="font-semibold mb-1">{label}</p>
      <p>{status.message}</p>
      {status.traceback && (
        <pre className="mt-2 text-xs bg-black/5 rounded p-2 whitespace-pre-wrap break-all overflow-auto max-h-40">
          {status.traceback}
        </pre>
      )}
    </div>
  );
}
