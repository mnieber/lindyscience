from argparse import ArgumentParser
from dodo_commands import Dodo
import os


def _make_dir_0x777(dirname):
    if not os.path.exists(dirname):
        Dodo.run(['sudo', 'mkdir', '-p', dirname])
    Dodo.run(['sudo', 'chmod', '777', dirname])


bashrc = """
"""


def _args():
    parser = ArgumentParser(description='Create data volume directories on the host for running linsci')
    args = Dodo.parse_args(parser)
    return args


# Use safe=False if the script makes changes other than through Dodo.run
if Dodo.is_main(__name__, safe=True):
    args = _args()

    base_dir = '/srv/linsci'
    _make_dir_0x777(base_dir)

    dirnames = ['.config', '.pytest_report', '.ipython', 'static', 'dumps', 'log']
    for dirname in [os.path.join(base_dir, x) for x in dirnames]:
        _make_dir_0x777(dirname)

    filenames = {
        '.bash_history': None,
        '.bashrc': bashrc,
    }

    for basename, contents in filenames.items():
        filename = os.path.join(base_dir, basename)
        if not os.path.exists(filename):
            Dodo.run(['sudo', 'touch', filename])
            if os.path.exists(filename):
                if contents:
                    with open(filename, 'w') as ofs:
                        ofs.write(contents)
                os.chmod(filename, 0o777)
