import type { MoveT } from "moves/types";

export function sayMove(move: MoveT) {
  const maxLength = 200;
  const utterance = new SpeechSynthesisUtterance(
    move.name.substr(0, maxLength)
  );
  return window.speechSynthesis.speak(utterance);
}
