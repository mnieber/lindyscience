import React from "react";

export function useFocus(element) {
  React.useEffect(() => {
    if (element) {
      element.focus();
    }
  }, [element]);
}
