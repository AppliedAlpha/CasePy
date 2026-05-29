# CasePy — OJ 테스트케이스 패키지 빌더

교내 **온라인 저지(OJ)** 시스템에 등록할 알고리즘 문제의 채점 패키지를 자동으로 생성하는 로컬 웹 도구입니다.  
정해 파이썬 코드를 입력하면, 각 테스트케이스의 stdin을 실행해 stdout을 자동 생성하고 규격에 맞는 `.zip` 파일로 패키징합니다.

---

## 주요 기능

- **테스트케이스 자동 생성** — 정해 코드 + stdin 입력 → `.in` / `.out` 파일 쌍 자동 생성
- **미리 실행** — ZIP 생성 전 각 케이스의 stdout을 즉시 확인
- **표현식 입력** — 랜덤 값 표현식으로 테스트케이스 자동 생성 (`{{1~100:d}}` 등)
- **TLE / 런타임 에러 감지** — 설정한 시간 제한 초과 시 즉시 경고
- **일괄 압축 해제** — `portable/unzip_tool.exe`로 생성된 패키지를 한 번에 압축 해제

---

## 실행 방법

### 요구 사항

- Python 3.x
- Flask (`pip install flask`)

### 서버 시작

```bash
cd backend
python app.py
```

브라우저에서 `http://localhost:5724` 접속.

> [!NOTE]
> 프론트엔드 빌드 결과물은 이미 `backend/static/` 및 `backend/templates/`에 포함되어 있습니다.  
> Node.js 없이 위 명령어 한 줄로 바로 사용할 수 있습니다.

---

## 사용법

1. **Problem ID** — 생성될 `.zip` 파일명 및 내부 파일명의 기준이 됩니다. (예: `prob_sort`)
2. **Time Limit** — 정해 코드의 실행 제한 시간 (초 단위, 기본값 1.0초)
3. **Testcase 폴더명** — ZIP 내부의 서브디렉토리명. 비우면 `Case`로 자동 지정됩니다.
4. **문제 설명** — `{문제ID}.txt`로 ZIP에 포함됩니다.
5. **정해 코드** — stdin을 받아 stdout을 출력하는 파이썬 스크립트
6. **테스트케이스 입력** — stdin을 직접 작성하거나, **표현식으로 입력** 버튼으로 랜덤 생성
7. **▶ 미리 실행** — 각 케이스의 stdout을 미리 확인
8. **패키지 생성 및 다운로드** — 검증 완료 후 `.zip` 파일 다운로드

### 생성되는 ZIP 구조

```
{문제ID}.zip
├── {Testcase폴더명}/
│   ├── 1.in
│   ├── 1.out
│   ├── 2.in
│   ├── 2.out
│   └── ...
├── {문제ID}.txt
└── {문제ID}.py
```

### 표현식 문법

테스트케이스 입력란에서 **표현식으로 입력** 버튼을 누르면 사용할 수 있습니다.

| 표현식 | 설명 |
|---|---|
| `{{A~B:d}}` | A 이상 B 이하의 랜덤 정수 |
| `{{A~B:Xf}}` | A 이상 B 이하의 랜덤 실수 (소수점 X자리) |
| `{{*:Xs}}` | X자리 랜덤 문자열 (A-Z, a-z, 0-9) |
| `\n` 또는 Enter | 줄바꿈 |

예시:
```
5\n{{1~100:d}} {{1~100:d}} {{1~100:d}} {{1~100:d}} {{1~100:d}}
```

---

## 프로젝트 구조

```
CasePy/
├── backend/
│   ├── app.py              # Flask 서버 (API + 정적 파일 서빙)
│   ├── requirements.txt    # Python 의존성
│   ├── templates/          # 빌드된 React HTML
│   └── static/             # 빌드된 JS / CSS 에셋
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/     # MetaForm, StdinGrid, ExprModal, Toast 등
│   ├── vite.config.js      # 빌드 시 backend/static으로 출력
│   └── package.json
├── portable/
│   └── unzip_tool.exe      # ZIP 일괄 압축 해제 독립 실행 파일
├── build_bundle.py         # 프론트엔드 빌드 + 통합 자동화 스크립트
└── README.md
```

---

## 개발 환경 세팅 (프론트엔드 수정 시)

```bash
# 의존성 설치
cd frontend
npm install

# 개발 서버 (포트 5173, API는 5724로 프록시)
npm run dev

# 프로덕션 빌드 및 백엔드 통합
cd ..
python build_bundle.py
```

---

## portable/unzip_tool.exe

생성된 `.zip` 파일을 한 번에 압축 해제하는 독립 실행 파일입니다.  
Python 없이도 동작하며, 실행 후 안내에 따라 대상 경로를 지정하면 각 ZIP을 동일한 이름의 폴더로 자동 해제합니다.

---

## 기여

이 프로젝트는 백엔드/프론트엔드 구현, 표현식 파서, 포터블 도구 빌드 등의 과정에서 **Claude (Anthropic)** 의 도움을 받아 개발되었습니다.  
