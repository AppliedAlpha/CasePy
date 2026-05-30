import EditorModule from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import './CodeEditor.css';

// react-simple-code-editor(0.14.1)의 CJS 빌드는 Vite/esbuild 인터롭에서
// default import가 네임스페이스 객체로 잡혀 React #130(invalid element type)을
// 유발한다. 실제 forwardRef 컴포넌트를 꺼내기 위해 .default를 직접 언래핑한다.
const Editor = EditorModule.default ?? EditorModule;

export default function CodeEditor({ value, onChange }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-700 mb-1">
        정해 코드 (Python) <span className="text-red-500">*</span>
      </h2>
      <p className="text-xs text-slate-400 mb-3">
        각 테스트케이스의 stdin을 받아 stdout을 생성하는 정해 파이썬 스크립트를 입력하세요.
      </p>
      <div className="code-editor border border-slate-300 rounded-lg bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent overflow-auto resize-y">
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={code => highlight(code, languages.python, 'python')}
          padding={12}
          tabSize={4}
          insertSpaces={true}
          textareaClassName="code-editor__textarea"
          placeholder={`import sys\n\ndata = sys.stdin.read().split()\n# 정해 코드 작성...`}
          style={{
            fontFamily: "ui-monospace, Consolas, 'Courier New', monospace",
            fontSize: 13,
            minHeight: '20rem',
          }}
        />
      </div>
    </div>
  );
}
