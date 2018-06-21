import jquery from 'jquery';


function post(url, data) {
  return jquery.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json'
    }
  })
}


function get(url, data) {
  return jquery.ajax({
    type: "GET",
    url: url,
    headers: {
      'Content-type': 'application/json'
    }
  })
}
