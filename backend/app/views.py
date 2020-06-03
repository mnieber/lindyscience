import json

from django.middleware.csrf import get_token
from django.shortcuts import render
from django.utils.html import mark_safe
from django.views import View

from app.schema import schema


class AppView(View):
    def get(self, request):
        # Force inclusion of csrftoken as a cookie
        csrf_token = get_token(request)
        assert csrf_token

        user_profile = schema.execute(
            """
            query queryUserProfile {
              userProfile {
                owner {
                  username
                }
                recentMoveUrl
                moveListIds
              }
            }
            """,
            context_value=request,
        )

        user_profile_str = json.dumps(user_profile.data).replace("None", "undefined")

        context = {"user_profile": mark_safe(user_profile_str)}
        return render(request, "app/app.html", context=context)
