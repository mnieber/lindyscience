// @flow

import * as React from "react";

// $FlowFixMe
export const DefaultPropsContext = React.createContext({});

export const withDefaultProps = (WrappedComponent: any) => (props: any) => {
  return (
    <DefaultPropsContext.Consumer>
      {defaultProps => {
        return <WrappedComponent {...props} defaultProps={defaultProps} />;
      }}
    </DefaultPropsContext.Consumer>
  );
};

export const mergeDefaultProps = <T>(props: any): T => {
  if (!props.defaultProps) {
    console.error("No default props: ", props);
  }
  return new Proxy(props, {
    get: function(obj, prop) {
      if (prop in obj) {
        return obj[prop];
      }
      if (prop in props.defaultProps) {
        return props.defaultProps[prop]();
      }
      return undefined;
    },
  });
};
