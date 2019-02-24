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


def assert_authorized(is_create, model, pk, user_id):
    instance = model.objects.filter(pk=pk).first()
    if instance and is_create:
        raise Exception("Cannot create existing object with id %s" % pk)

    if not instance and not is_create:
        raise Exception("Cannot update non-existing object with id %s" % pk)

    if instance and instance.owner_id != user_id:
        raise Exception("Not authorized to update object with id %s" % pk)

    return instance