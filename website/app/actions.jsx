import React from 'react'
import * as fromStore from 'moves/reducers'
import {toTitleCase} from 'utils/utils'

///////////////////////////////////////////////////////////////////////
// Actions
///////////////////////////////////////////////////////////////////////

export function actSetUserProfile(profile) {
  return {
    type: 'SET_USER_PROFILE',
    profile,
  }
}
