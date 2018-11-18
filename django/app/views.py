from django.views import View
from django.utils.text import mark_safe
from django.shortcuts import render
from app.schema import schema
import json


class AppView(View):
    def get(self, request):
        user_profile = schema.execute(
            '''
            query queryUserProfile {
              userProfile {
                owner {
                  username
                }
                recentMoveList {
                  id
                }
                moveListIds
              }
            }
            ''',
            context_value=request)

        user_profile_str = json.dumps(user_profile.data).replace(
            'None', 'undefined')

        context = {'user_profile': mark_safe(user_profile_str)}
        return render(request, 'app/app.html', context=context)
