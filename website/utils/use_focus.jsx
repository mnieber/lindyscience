import React from "react";

export function useFocus(element) {
  React.useEffect(() => {
    const hack = false;
    if (hack) {
      if (element) {
        setTimeout(() => {
          element.focus();
        }, 500);
      }
    } else {
      if (element) {
        element.focus();
      }
    }
  }, [element]);
}
