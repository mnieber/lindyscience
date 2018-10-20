import { PropTypes, shape } from 'prop-types';

export const moveType = shape({
  id: PropTypes.string.isRequired,
  difficulty: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  owner: PropTypes.number.isRequired,
});

export const videoLinkType = shape({
  id: PropTypes.string.isRequired,
  move: PropTypes.string.isRequired,
  owner: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  initialVoteCount: PropTypes.number.isRequired,
  voteCount: PropTypes.number.isRequired,
});

export const tipType = shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  initialVoteCount: PropTypes.number.isRequired,
  voteCount: PropTypes.number.isRequired,
  owner: PropTypes.number.isRequired,
  move: PropTypes.string.isRequired,
});

export const voteType = PropTypes.oneOf([-1, 0, 1]);