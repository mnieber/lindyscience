import jquery from 'jquery';
import { toCamelCase } from 'jsx/utils/utils'
import { get, post, patch } from 'jsx/utils/api_utils'


export function voteMoveVideoLink(id, value) {
  if (value != 0) {
    const vote = value == 1 ? 'true' : 'false';
    return post(`/votes/up/?model=movevideolink&id=${id}&vote=${vote}`)
  }
  else {
    return post(`/votes/down/?model=movevideolink&id=${id}`)
  }
}

export function patchMoveVideoLink(id, values) {
  return patch(`/move-video-link/${id}/`, values);
}

export function loadMoveDescription(moveName) {
  return get(`/moves/${moveName}/description`);
}

export function loadMoves() {
  return get(`/moves`)
  .then(response => toCamelCase(response));
}

export function loadVotes() {
  return get(`/votes`)
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
  return get(`/move-video-links`)
  .then(response => toCamelCase(response));
}
