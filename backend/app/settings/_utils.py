def chop(x):
    if x.endswith("\n"):
        return x[:-1]
    return x


def file_contents(filename, is_chop=True):
    with open(filename) as ifs:
        contents = ifs.read()
        return chop(contents) if is_chop else contents
