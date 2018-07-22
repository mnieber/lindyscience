from rest_framework.response import Response


def _success(data):
    return Response(dict(success=True, data=data), status=200)


def _failure(error, status):
    return Response(dict(success=False, error=error), status=status)


def _response_from_serializer(is_valid, serializer):
    if is_valid:
        return _success(serializer.data)

    error_strings = []
    for field, errors in serializer.errors.items():
        error_strings.append("%s - %s" % (field, "/".join(errors)))

    return _failure(error=", ".join(error_strings), status=400)
