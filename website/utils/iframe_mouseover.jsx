// @flow

import * as React from "react";
import jQuery from "jquery";

type DataT = {
  iframeMouseOver: boolean,
};

var _dataStore = {};

function setIFrameMouseOver(parentDivId: string, x: boolean) {
  _dataStore[parentDivId].iframeMouseOver = x;
}

function getIFrameMouseOver(parentDivId: string) {
  return _dataStore[parentDivId].iframeMouseOver;
}

export function listenToIFrame(parentDivId: string, iframe: any) {
  if (!_dataStore[parentDivId]) {
    _dataStore[parentDivId] = {
      iframeMouseOver: false,
    };
    const focusParentDiv = () => {
      const elm = document.getElementById(parentDivId);
      if (elm) {
        elm.focus();
      }
    };
    focusParentDiv();

    window.addEventListener("blur", function(e: any) {
      if (document.activeElement == iframe && getIFrameMouseOver(parentDivId)) {
        setTimeout(focusParentDiv, 100);
      }
    });

    iframe.addEventListener("mouseover", function() {
      setIFrameMouseOver(parentDivId, true);
    });
    iframe.addEventListener("mouseout", function() {
      setIFrameMouseOver(parentDivId, false);
    });
  }
}
