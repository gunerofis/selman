import guner_context
import runpy
from pathlib import Path
if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).with_name('journal.py')),run_name='__main__')
