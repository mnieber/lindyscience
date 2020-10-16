import React from 'react';

interface PropsT {
  onCancel: Function;
}

export const CancelButton: React.FC<PropsT> = (props: PropsT) => (
  <button
    className="button button--wide ml-2"
    onClick={(e) => {
      e.preventDefault();
      props.onCancel();
    }}
  >
    cancel
  </button>
);
