declare module 'mergeDefaultProps' {
  declare export function mergeDefaultProps<T>(props: { defaultProps: any }): T;
  declare export function NestedDefaultPropsProvider(props: {
    children: any,
    value: any,
    defaultProps?: any,
  }): any;
  declare export function withDefaultProps(WrappedComponent: any): any;
  declare export var DefaultPropsContext: any;
  declare export type UseDefaultPropsT = { defaultProps?: any };
}
