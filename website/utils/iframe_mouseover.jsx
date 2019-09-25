// @flow

import * as React from "react";

type DataT = {
  iframeMouseOver: boolean,
  idOfElementToGiveFocus: any,
};

var _dataStore = {};

function setIFrameMouseOver(clientName: string, x: boolean) {
  _dataStore[clientName].iframeMouseOver = x;
}

function getIFrameMouseOver() {
  return _dataStore[clientName].iframeMouseOver;
}

export function setIdOfElementToGiveFocus(clientName: string, id: string) {
  // $FlowFixMe
  _singleton.idOfElementToGiveFocus[clientName] = id;
}

export function getIdOfElementToGiveFocus(clientName: string) {
  return _singleton.idOfElementToGiveFocus[clientName];
}

export function watchIFrameMouseOver(clientName: string) {
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
