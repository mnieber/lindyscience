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


export function setLikeMoveVideoLink(id, value) {
  if (value) {
    return post(`/votes/up/?model=movevideolink&id=${id}&vote=true`)
  }
  else {
    return post(`/votes/down/?model=movevideolink&id=${id}`)
  }
}