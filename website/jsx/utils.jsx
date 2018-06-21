import React from 'react'
import ReduxToastr from 'react-redux-toastr'

import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'


export function createToastr() {
  return <ReduxToastr
    timeOut={4000}
    newestOnTop={false}
    preventDuplicates
    transitionIn="fadeIn"
    transitionOut="fadeOut"
    progressBar={false}
  />
}