import os
import sys
import zipfile
import tempfile
import subprocess
from flask import Flask, request, send_file, jsonify, render_template

app = Flask(__name__, static_folder='static', template_folder='templates')


@app.route('/')
def serve_frontend():
    return render_template('index.html')


@app.route('/api/generate-pack', methods=['POST'])
def generate_package():
    data = request.get_json() or {}

    prob_id = data.get("problem_id", "").strip()
    sol_code = data.get("solution_code", "")
    description = data.get("description", "")
    test_cases = data.get("test_cases", [])
    time_limit = float(data.get("time_limit", 1.0))

    if not prob_id or not sol_code:
        return jsonify({
            "status": "failed",
            "error_type": "BadRequest",
            "message": "필수 파라미터(problem_id, solution_code)가 유실되었습니다."
        }), 400

    target_dir = data.get("testcase_dir", "").strip()
    if not target_dir:
        target_dir = "Case"

    with tempfile.TemporaryDirectory() as tmpdir:
        case_folder_path = os.path.join(tmpdir, target_dir)
        os.makedirs(case_folder_path, exist_ok=True)

        with open(os.path.join(tmpdir, f"{prob_id}.txt"), "w", newline="\n", encoding="utf-8") as f:
            f.write(description)

        with open(os.path.join(tmpdir, f"{prob_id}.py"), "w", newline="\n", encoding="utf-8") as f:
            f.write(sol_code)

        for idx, stdin_str in enumerate(test_cases, start=1):
            with open(os.path.join(case_folder_path, f"{idx}.in"), "w", newline="\n", encoding="utf-8") as f:
                f.write(stdin_str)

            try:
                res = subprocess.run(
                    [sys.executable, "-c", sol_code],
                    input=stdin_str,
                    text=True,
                    capture_output=True,
                    timeout=time_limit
                )

                if res.returncode != 0:
                    return jsonify({
                        "status": "failed",
                        "error_type": "RuntimeError",
                        "message": f"테스트 케이스 {idx}번 가상 실행 중 예외 런타임 에러가 발생했습니다.",
                        "traceback": res.stderr
                    }), 422

                with open(os.path.join(case_folder_path, f"{idx}.out"), "w", newline="\n", encoding="utf-8") as f:
                    f.write(res.stdout)

            except subprocess.TimeoutExpired:
                return jsonify({
                    "status": "failed",
                    "error_type": "TimeLimitExceeded",
                    "message": f"테스트 케이스 {idx}번 실행 중 제한 시간({time_limit}초)을 초과했습니다. 알고리즘 효율성을 재고하십시오.",
                    "traceback": None
                }), 422

        zip_output_path = os.path.join(tempfile.gettempdir(), f"{prob_id}_bundle.zip")
        with zipfile.ZipFile(zip_output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(tmpdir):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, tmpdir)
                    zipf.write(full_path, rel_path)

    return send_file(
        zip_output_path,
        mimetype='application/zip',
        as_attachment=True,
        download_name=f"{prob_id}.zip"
    )


@app.route('/api/preview', methods=['POST'])
def preview():
    data = request.get_json() or {}
    sol_code = data.get("solution_code", "")
    test_cases = data.get("test_cases", [])
    time_limit = float(data.get("time_limit", 1.0))

    if not sol_code:
        return jsonify({"status": "failed", "message": "solution_code가 없습니다."}), 400

    results = []
    for idx, stdin_str in enumerate(test_cases, start=1):
        try:
            res = subprocess.run(
                [sys.executable, "-c", sol_code],
                input=stdin_str,
                text=True,
                capture_output=True,
                timeout=time_limit
            )
            if res.returncode != 0:
                results.append({
                    "index": idx,
                    "success": False,
                    "error_type": "RuntimeError",
                    "stdout": res.stdout,
                    "stderr": res.stderr,
                })
            else:
                results.append({
                    "index": idx,
                    "success": True,
                    "error_type": None,
                    "stdout": res.stdout,
                    "stderr": "",
                })
        except subprocess.TimeoutExpired:
            results.append({
                "index": idx,
                "success": False,
                "error_type": "TimeLimitExceeded",
                "stdout": "",
                "stderr": f"제한 시간({time_limit}초) 초과. 무한 루프 여부를 확인하세요.",
            })

    return jsonify({"results": results})


if __name__ == '__main__':
    app.run(port=5724, debug=True)
