export type BundleType = 'rollup' | 'babel';

interface IBundleTypeOutput {
  type: BundleType;
  file?: string;
}

export interface ICjs extends IBundleTypeOutput {
  minify?: boolean;
  lazy?: boolean;
}


interface IEsm extends IBundleTypeOutput {
  mjs?: boolean;
  minify?: boolean;
  importLibToEs?: boolean;
}

interface IStringObject {
  [prop: string]: string;
}


interface IStringArrayObject {
  [prop: string]: string[];
}

export interface IBundleOptions {
  entry?: string | string[];
  file?: string;
  esm?: BundleType | IEsm | false;
  cjs?: BundleType | ICjs | false;
}

export interface IOpts {
  cwd: string;
  watch?: boolean;
  buildArgs?: IBundleOptions;
  rootConfig?: IBundleOptions;
  rootPath?: string;
}