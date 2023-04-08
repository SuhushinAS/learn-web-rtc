import {FormatXMLElementFn, PrimitiveType} from 'intl-messageformat';
import React from 'react';

export type TLocaleStore = {
  current: string;
  data: TLocaleData;
  list: string[];
};

export type TLocaleData = {
  [key: string]: TLocale;
};

export type TLocale = {
  [key: string]: string;
};

export type TMessageProps<V> = {
  id: string;
  values?: V;
};

export type TMessageValues = Record<
  string,
  React.ReactNode | PrimitiveType | FormatXMLElementFn<React.ReactNode, React.ReactNode>
>;

export type TMessage = <V>(id: string, values?: V) => string;
