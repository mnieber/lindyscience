// @notyetflow

import Cookies from 'js-cookie';
import jQuery from 'jquery';

import { spy, toJS } from 'mobx';
import { options as facetOptions } from 'facility';

function csrfSafeMethod(method: string) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}

export const configureStore = () => {
  jQuery.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (!csrfSafeMethod(settings.type ?? '') && !this.crossDomain) {
        xhr.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken') ?? '');
      }
      if (Cookies.get('authToken') && settings.url !== '/auth/token/login') {
        xhr.setRequestHeader(
          'Authorization',
          'Token ' + Cookies.get('authToken')
        );
      }
    },
    traditional: true,
  });

  const logFacet = true;
  const logMobX = false;
  const logMobXBlackList = ['relayData'];

  if (logFacet) {
    facetOptions.logging = true;
    facetOptions.formatObject = (x) => toJS(x);
  }

  if (logMobX) {
    spy((event) => {
      if (
        event.type === 'action' &&
        !logMobXBlackList.includes(event.name.split(' ')[0])
      ) {
        const args = event.arguments.length
          ? ` with args: ${event.arguments}`
          : '';
        const css = 'background: #222; color: #bada55';
        console.log(`%c${event.name}`, css, `${args}`);
      }
    });
  }
};
