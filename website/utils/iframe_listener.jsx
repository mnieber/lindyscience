// @flow

import * as React from "react";
import jQuery from "jquery";

type DataT = {
  iframeMouseOver: boolean,
  iframe: any,
};

var _iframes = {};
var _dataStore = {};

function createDataStore(parentDivId: string, iframe: any) {
  _dataStore[parentDivId] = {
    iframeMouseOver: false,
    iframe: iframe,
  };

  const focusParentDiv = () => {
    const elm = document.getElementById(parentDivId);
    if (elm) {
      let x = window.scrollX,
        y = window.scrollY;
      elm.focus();
      window.scrollTo(x, y);
    }
  };

  window.addEventListener("blur", function(e: any) {
    const data = _dataStore[parentDivId];

    if (document.activeElement == data.iframe && data.iframeMouseOver) {
      setTimeout(focusParentDiv, 100);
    }
  });

  return focusParentDiv;
}

function updateDataStore(parentDivId: string, iframe: any) {
  _dataStore[parentDivId].iframe = iframe;
}

function registerIframe(parentDivId: string, iframe: any) {
  if (!_iframes[iframe]) {
    _iframes[iframe] = true;
    iframe.addEventListener("mouseover", function() {
      _dataStore[parentDivId].iframeMouseOver = true;
    });
    iframe.addEventListener("mouseout", function() {
      _dataStore[parentDivId].iframeMouseOver = false;
    });
  }
}

export function listenToIFrame(parentDivId: string, iframe: any) {
  if (!_dataStore[parentDivId]) {
    const focusParentDiv = createDataStore(parentDivId, iframe);
    focusParentDiv();
  } else {
    updateDataStore(parentDivId, iframe);
  }

  registerIframe(parentDivId, iframe);
}
