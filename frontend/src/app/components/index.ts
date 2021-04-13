import { apiUpdateProfile } from 'src/profiles/api';
export { App } from './App';

export function browseToMoveUrl(
  setUrl: Function,
  moveUrlParts: Array<string>,
  mustUpdateProfile: boolean
) {
  const moveUrl = moveUrlParts.filter((x) => !!x).join('/');
  const fullUrl = `/lists/${moveUrl}`;
  if (window.location.pathname !== fullUrl) {
    if (mustUpdateProfile) {
      apiUpdateProfile(moveUrl);
    }
    setUrl(fullUrl);
  }
}
