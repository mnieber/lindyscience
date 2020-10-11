import os
from argparse import ArgumentParser

from dodo_commands import CommandError, ConfigArg, Dodo


def _args():
    parser = ArgumentParser(description="Publish own npm packages")

    # Add arguments to the parser here

    # Parse the arguments.
    args = Dodo.parse_args(parser, config_args=[])

    args.cwd = Dodo.get("/ROOT/project_dir")
    args.npm_dir = "/opt/linsci/npm"

    # Raise an error if something is not right
    if False:
        raise CommandError("Oops")

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
    Dodo.run(["npm", "adduser", "--registry", "http://verdaccio:4873"])
    for src_sub_dir in src_sub_dirs:
        src_dir = os.path.join(args.npm_dir, src_sub_dir)
        Dodo.run(["./node_modules/.bin/tsc", "--outDir", "dist"], cwd=src_dir)
        Dodo.run(["yarn", "version", "--patch"], cwd=src_dir)
        Dodo.run(["npm", "publish", "--registry", "http://verdaccio:4873"], cwd=src_dir)
