import { join } from 'path';
import { IOpts, IBundleOptions, IBundleTypeOutput, ICjs, IEsm } from './types';
import { getExistFile } from './utils';

export function getBundleOpts(options: IOpts): IBundleOptions[] {
  const { cwd, buildArgs = {}, rootConfig = {} } = options;
  const entry = getExistFile({
    cwd,
    files: ['src/index.tsx', 'src/index.ts', 'src/index.jsx', 'src/index.js'],
    returnRelative: true,
  });


}

export default async function build(options: IOpts) {
  const { cwd, watch } = options;
  // 获取配置列表 返回数组对象
  const bundleOptsArray = getBundleOpts(options);
}