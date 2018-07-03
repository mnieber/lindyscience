import jquery from 'jquery';
import { toCamelCase } from 'jsx/utils'


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


function get(url) {
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

export function loadMoveDescription(moveName) {
  return jquery.ajax({
    type: 'GET',
    url: `/moves/${moveName}/description`
  });
}

export function loadMoves() {
  return jquery.ajax({
    type: 'GET',
    url: `/moves`
  })
  .then(response => toCamelCase(response));
}

export function loadMoveVideoLinks() {
  return jquery.ajax({
    type: 'GET',
    url: `/move-video-links`
  })
  .then(response => toCamelCase(response));
}
