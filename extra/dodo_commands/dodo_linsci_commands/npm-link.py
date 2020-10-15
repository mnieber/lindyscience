import os
from argparse import ArgumentParser

from dodo_commands import CommandError, ConfigArg, Dodo


def _args():
    parser = ArgumentParser(description="Publish own npm packages")
    parser.add_argument("--unlink", action="store_true")

    # Parse the arguments.
    args = Dodo.parse_args(parser, config_args=[])
    args.npm_dir = "/opt/linsci/npm"
    return args


# Use safe=False if the script makes changes other than through Dodo.run
if Dodo.is_main(__name__, safe=True):
    args = _args()

    src_sub_dirs = [
        "react-form-state-context",
        "react-default-props-context",
        "facet",
        "facet-mobx",
    ]

    action = "unlink" if args.unlink else "link"
    for src_sub_dir in src_sub_dirs:
        src_dir = os.path.join(args.npm_dir, src_sub_dir)
        dist_dir = os.path.join(args.npm_dir, src_sub_dir, "dist")
        Dodo.run(["yarn", action], cwd=dist_dir)
        Dodo.run(["yarn", action, src_sub_dir], cwd="/opt/linsci/src")
