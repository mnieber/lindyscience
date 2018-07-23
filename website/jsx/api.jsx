import jquery from 'jquery';
import { toCamelCase, toSnakeCase } from 'jsx/utils/utils'
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
  return post(`/move-video-links/`, toSnakeCase(values));
}

export function patchMoveVideoLink(id, values) {
  return patch(`/move-video-links/${id}/`, toSnakeCase(values));
}

export function saveMoveTip(values) {
  return post(`/move-tips/`, toSnakeCase(values));
}

export function saveMove(values) {
  return post(`/moves/`, toSnakeCase(values));
}

export function patchMove(id, values) {
  return patch(`/moves/${id}/`, toSnakeCase(values));
}

export function patchMoveTip(id, values) {
  return patch(`/move-tips/${id}/`, toSnakeCase(values));
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
