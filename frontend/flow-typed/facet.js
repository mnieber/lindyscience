declare module 'facet' {
  declare type DataFunction = (
    dataHost: any,
    dataMember: string,
    descriptor: any
  ) => any;

  declare export function isDataMember(facetClass: any, prop: string): any;
  declare export var data: DataFunction;
  declare export var input: DataFunction;
  declare export var output: DataFunction;

  declare export function facet(
    facetClass: any
  ): (facetHost: any, facetMember: string, descriptor: any) => any;
  declare export function registerFacets(ctr: any): any;
  declare export function getFacet(facetClass: any, ctr: any): any;

  declare export function handle(
    operationHost: any,
    operationMember: string,
    callback: Function
  ): any;

  declare export function installPolicies(
    policies: Array<Function>,
    ctr: any
  ): any;
  declare export function installHandlers(
    handlers: { [string]: Function },
    facet: any
  ): any;

  declare export function listen(
    operationHost: any,
    operationMember: string,
    callback: Function
  ): any;
  declare export function operation(
    operationHost: any,
    operationMember: string,
    descriptor: any
  ): any;

  declare export function facetClassName(facetClass: any): string;
  declare export function facetName(facetClass: any): string;

  declare export var options: {
    logging: boolean,
    formatObject: Function,
  };

  declare export type ClassT = any;
  declare export type MemberNameT = string;
  declare export type ClassMemberT = [ClassT, MemberNameT];
  declare export type AdapterT = {
    [MemberNameT]: ClassMemberT,
  };
}

declare module 'facet/internal/logging' {
  declare export function opName(operationMember: string): string;
  declare export function log(
    ctr: any,
    operationMember: string,
    facet: any,
    args: any,
    start: boolean
  ): any;
  declare export function containerState(ctr: any): any;
}

declare module 'facet/internal/symbols' {
  declare export function symbolName(symbol: Symbol): any;
}

declare module 'facet/internal/utils' {
  declare export function getOrCreate(
    obj: any,
    key: string | Symbol,
    fn: Function
  ): any;
}
