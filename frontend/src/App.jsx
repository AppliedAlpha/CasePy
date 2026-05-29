import { useState } from 'react';
import MetaForm from './components/MetaForm';
import StdinGrid from './components/StdinGrid';
import CodeEditor from './components/CodeEditor';
import DescEditor from './components/DescEditor';
import StatusBanner from './components/StatusBanner';
import { useToast } from './components/Toast.jsx';

const INITIAL_STATE = {
  problemId: '',
  timeLimit: 1.0,
  testcaseDir: '',
  description: '',
  solutionCode: '',
  testCases: [''],
};

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

export default function App() {
  const { addToast } = useToast();

  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewResults, setPreviewResults] = useState(null);
  const [packError, setPackError] = useState(null);

  function handleMetaChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'solutionCode' || field === 'timeLimit') {
      setPreviewResults(null);
    }
  }

  function handleTestCasesChange(cases) {
    setForm(prev => ({ ...prev, testCases: cases }));
    setPreviewResults(null);
  }

  async function handlePreview() {
    if (!form.solutionCode.trim()) return;
    setPreviewing(true);
    setPreviewResults(null);

    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solution_code: form.solutionCode,
          test_cases: form.testCases,
          time_limit: form.timeLimit,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        const byIndex = {};
        for (const r of json.results) {
          byIndex[r.index - 1] = r;
        }
        setPreviewResults(byIndex);

        const total = json.results.length;
        const errCount = json.results.filter(r => !r.success).length;

        if (errCount === 0) {
          addToast(`${total}개 테스트케이스 모두 실행 성공`, 'success');
        } else {
          addToast(`${total}개 중 ${errCount}개 케이스에서 에러 발생`, 'error');
        }
      } else {
        addToast(json.message || '미리 실행 중 오류가 발생했습니다.', 'error');
      }
    } catch (err) {
      addToast(`네트워크 오류: ${err.message}`, 'error');
    } finally {
      setPreviewing(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPackError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generate-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_id: form.problemId,
          testcase_dir: form.testcaseDir,
          time_limit: form.timeLimit,
          description: form.description,
          solution_code: form.solutionCode,
          test_cases: form.testCases,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${form.problemId}.zip`;
        a.click();
        URL.revokeObjectURL(url);
        addToast(`${form.problemId}.zip 다운로드 완료`, 'success');
      } else {
        const json = await res.json();
        setPackError({
          type: json.error_type || 'Error',
          message: json.message || '알 수 없는 오류가 발생했습니다.',
          traceback: json.traceback || null,
        });
        addToast('패키지 생성 실패. 아래 오류를 확인하세요.', 'error');
      }
    } catch (err) {
      addToast(`네트워크 오류: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(INITIAL_STATE);
    setPreviewResults(null);
    setPackError(null);
    addToast('모든 입력이 초기화되었습니다.', 'warning');
  }

  const canPreview = form.solutionCode.trim() && !previewing && !loading;
  const canSubmit = form.problemId.trim() && form.solutionCode.trim() && !loading && !previewing;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        <header className="mb-8 flex items-center justify-center relative">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">CasePy</h1>
            <p className="mt-1 text-sm text-slate-500">OJ 테스트케이스 패키지 빌더</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading || previewing}
            className="absolute right-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="모든 입력 초기화"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            초기화
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <MetaForm
            problemId={form.problemId}
            timeLimit={form.timeLimit}
            testcaseDir={form.testcaseDir}
            onChange={handleMetaChange}
          />

          <DescEditor
            value={form.description}
            onChange={v => handleMetaChange('description', v)}
          />

          <CodeEditor
            value={form.solutionCode}
            onChange={v => handleMetaChange('solutionCode', v)}
          />

          <StdinGrid
            testCases={form.testCases}
            previewResults={previewResults}
            onChange={handleTestCasesChange}
          />

          <button
            type="button"
            onClick={handlePreview}
            disabled={!canPreview}
            className="w-full py-2.5 px-6 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {previewing ? <><Spinner /> 실행 중...</> : '▶ 미리 실행 (stdout 확인)'}
          </button>

          {/* 패키지 생성 에러만 인라인 배너로 표시 (traceback 포함) */}
          <StatusBanner status={packError} />

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <><Spinner /> 패키지 생성 중...</> : '패키지 생성 및 다운로드'}
          </button>
        </form>

      </div>
    </div>
  );
}
