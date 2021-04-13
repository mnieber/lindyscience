import { DisplayProvider } from 'src/app/DisplayProvider';
import { MoveListsCtrProvider } from 'src/movelists/components/MovelistsCtrProvider';
import { MovesCtrProvider } from 'src/moves/components/MovesCtrProvider';
import { AppFrame } from 'src/app/components/AppFrame';
import { UrlRouter } from 'src/app/components/UrlRouter';

export function App() {
  return (
    <DisplayProvider>
      <MoveListsCtrProvider>
        <MovesCtrProvider>
          <AppFrame>
            <UrlRouter />
          </AppFrame>
        </MovesCtrProvider>
      </MoveListsCtrProvider>
    </DisplayProvider>
  );
}
