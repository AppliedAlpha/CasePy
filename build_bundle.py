import os
import shutil
import subprocess


def run_hybrid_build():
    root_path = os.path.abspath(os.path.dirname(__file__))
    frontend_path = os.path.join(root_path, 'frontend')
    backend_path = os.path.join(root_path, 'backend')

    print("[1/3] 프론트엔드 React 프로덕션 컴파일 가동...")
    subprocess.run(['npm', 'run', 'build'], cwd=frontend_path, shell=True, check=True)

    print("[2/3] 빌드된 index.html 자산 마이그레이션...")
    src_html = os.path.join(backend_path, 'static', 'index.html')
    dest_template_dir = os.path.join(backend_path, 'templates')
    os.makedirs(dest_template_dir, exist_ok=True)

    if os.path.exists(src_html):
        shutil.move(src_html, os.path.join(dest_template_dir, 'index.html'))
        print(" -> index.html 이 templates/ 폴더로 성공적으로 리로케이션 되었습니다.")
    else:
        print(" [경고] static/index.html 을 찾을 수 없습니다. 빌드 결과를 확인하세요.")

    print("[3/3] CasePy 하이브리드 통합 컴파일 완수. backend/ 폴더를 압축 배포 가능합니다.")


if __name__ == '__main__':
    run_hybrid_build()
