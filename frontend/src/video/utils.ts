export function timePointRegex() {
  return /<([\d.:]+)>/g;
}

export function parseVideoTimePoint(x: string): number | null {
  const parts = x.split(':');
  const secs = parts.pop() || '0';
  const mins = parts.pop() || '0';
  const hours = parts.pop() || '0';

  try {
    return parseFloat(secs) + 60 * parseFloat(mins) + 3600 * parseFloat(hours);
  } catch {}
  return null;
}

export function extractTimePoints(text: string): Array<number> {
  const result: number[] = [];
  const r = timePointRegex();
  let matchArr;
  while ((matchArr = r.exec(text)) !== null) {
    const tpString = (matchArr as any)[1];
    const tp = parseVideoTimePoint(tpString);
    if (tp !== null) {
      result.push(tp);
    }
  }
  return result;
}

export function isYoutubePlaying(player: any) {
  return [1, 3].includes(player.getPlayerState());
}

export function splitKeyhandlerKeys(keyHandlers: { [key: string]: Function }) {
  return Object.entries(keyHandlers).reduce((acc: any, [keys, f]) => {
    keys.split(';').forEach((key) => (acc[key] = f));
    return acc;
  }, {});
}

export function timePointToClassName(tp: number | null) {
  return 'tp-' + ((tp || '') + '').replace('.', '-');
}
