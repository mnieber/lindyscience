// @flow

import * as React from "react";

var _singleton = {
  iframeMouseOver: false,
  initialized: false,
  idOfElementToGiveFocus: null,
};

function setIFrameMouseOver(x: boolean) {
  _singleton.iframeMouseOver = x;
}

function getIFrameMouseOver() {
  return _singleton.iframeMouseOver;
}

export function setIdOfElementToGiveFocus(id: string) {
  // $FlowFixMe
  _singleton.idOfElementToGiveFocus = id;
}

export function getIdOfElementToGiveFocus() {
  return _singleton.idOfElementToGiveFocus;
}

export function watchIFrameMouseOver() {
  if (!_singleton.initialized) {
    window.addEventListener("blur", function() {
      if (getIFrameMouseOver()) {
        setTimeout(() => {
          const elmId = getIdOfElementToGiveFocus();
          if (elmId != null) {
            const elm = document.getElementById(elmId);
            if (elm) {
              elm.focus();
            }
          }
        }, 100);
      }
    });

    document
      .getElementsByTagName("iframe")[0]
      // $FlowFixMe
      .addEventListener("mouseover", function() {
        setIFrameMouseOver(true);
      });
    document
      .getElementsByTagName("iframe")[0]
      // $FlowFixMe
      .addEventListener("mouseout", function() {
        setIFrameMouseOver(false);
      });
  }
}
