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

export function voteMoveVideoLink(id, value) {
  if (value != 0) {
    const vote = value == 1 ? 'true' : 'false';
    return post(`/votes/up/?model=movevideolink&id=${id}&vote=${vote}`)
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

export function loadVotes() {
  return jquery.ajax({
    type: 'GET',
    url: `/votes`
  })
  .then(response => toCamelCase(response))
  .then(response => response.map(x => {
    x.vote = (x.vote ? 1 : -1);
    return x;
  }))
  .then(response => {
    const votes = {};
    votes.moveVideoLinks = response.filter(x => x.model='MoveVideoLink');
    return votes;
  });
}

export function loadMoveVideoLinks() {
  return jquery.ajax({
    type: 'GET',
    url: `/move-video-links`
  })
  .then(response => toCamelCase(response));
}
