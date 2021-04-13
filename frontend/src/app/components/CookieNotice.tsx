import { useStore } from 'src/app/components/StoreProvider';
import { observer } from 'mobx-react';

import './CookieNotice.scss';

export const CookieNotice: React.FC = observer(() => {
  const { profilingStore } = useStore();

  return (
    <div className="cookieNotice flexrow justify-around items-center">
      <div>
        This site uses cookies to store the settings for the logged in user. By
        continuing to use this site you agree with that.
        <button
          className="button button--wide ml-2"
          onClick={profilingStore.acceptCookies.bind(profilingStore)}
        >
          Okay
        </button>
      </div>
    </div>
  );
});
