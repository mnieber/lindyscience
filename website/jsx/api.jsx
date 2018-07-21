import jquery from 'jquery';
import { toCamelCase } from 'jsx/utils/utils'
import { get, post, patch } from 'jsx/utils/api_utils'


export function voteMoveVideoLink(id, value) {
  return post(
    `/votes`,
    {
      model: 'MoveVideoLink',
      app_label: 'moves',
      object_id: id,
      value: value
    })
}

export function voteMoveTip(id, value) {
  return post(
    `/votes`,
    {
      model: 'MoveTip',
      app_label: 'moves',
      object_id: id,
      value: value
    })
}

export function saveMoveVideoLink(values) {
  if (!values.url.startsWith('http://') && !values.url.startsWith('https://')) {
    values = {...values,
      url: 'http://' + values.url
    }
  }
  return post(`/move-video-links/`, values);
}

export function patchMoveVideoLink(id, values) {
  return patch(`/move-video-links/${id}/`, values);
}

export function saveMoveTip(values) {
  return post(`/move-tips/`, values);
}

export function patchMoveTip(id, values) {
  return patch(`/move-tips/${id}/`, values);
}

export function loadMoveDescription(moveName) {
  return get(`/moves/${moveName}/description`);
}

export function loadMovePrivateNotes(moveId) {
  return get(`/moves/${moveId}/private-notes`);
}

export function loadMoves() {
  return get(`/moves`)
  .then(response => toCamelCase(response));
}

export function loadVotes() {
  return get(`/votes`)
  .then(response => toCamelCase(response))
  .then(response => {
    const votes = {};
    votes.moveVideoLinks = response.filter(x => x.model='MoveVideoLink');
    return votes;
  });
}

export function loadMoveVideoLinks() {
  return get(`/move-video-links`)
  .then(response => toCamelCase(response))
  .then(response => {
      response.forEach(link => {
        link.initialVoteCount = link.voteCount
      });
      return response;
  })
}

export function loadMoveTips() {
  return get(`/move-tips`)
  .then(response => toCamelCase(response))
  .then(response => {
      response.forEach(tip => {
        tip.initialVoteCount = tip.voteCount
      });
      return response;
  })
}
