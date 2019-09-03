from ._utils import log_request, log_response
import re


def request_logging_middleware(get_response):
    def _log_response(request, response):
        if request.path.startswith("/api/"):
            if re.match('^application/json', response.get('Content-Type', ''),
                        re.I):
                log_response("RSP", request.method, request.get_full_path(),
                             response.content, response.status_code)

    def middleware(request):
        if True or request.path.startswith("/api/"):
            if (request.body):
                log_request("REQ", request.method, request.get_full_path(),
                            request.body)

        response = get_response(request)
        return response

    return middleware
