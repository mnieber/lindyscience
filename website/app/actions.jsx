import React from 'react'
import * as fromStore from 'moves/reducers'
import {toTitleCase} from 'utils/utils'

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actSetIOStatus(value) {
  return (dispatch, getState) => {
    dispatch({
      type: 'SET_IO_STATUS',
      value: "before" + toTitleCase(value),
    });

    dispatch({
      type: 'SET_IO_STATUS',
      value: value,
    });
  }
}

export function actSetUserProfile(profile) {
  return {
    type: 'SET_USER_PROFILE',
    profile,
  }
}
