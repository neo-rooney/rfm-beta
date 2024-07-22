import { BuildOptions } from 'esbuild';

export type createContextParams = {
  format: 'cjs' | 'esm';
  outExtension?: { [ext: string]: string };
  config: BuildOptions;
};

export type runParams = {
  entryPoints?:
    | string[]
    | Record<string, string>
    | { in: string; out: string }[];
  pkg: any;
  config?: BuildOptions;
};
