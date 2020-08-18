import { join } from 'path';
import { merge } from 'lodash';
import rimraf from 'rimraf';
import chalk from 'chalk';
import { IOpts, IBundleOptions, IBundleTypeOutput, ICjs, IEsm } from './types';
import { getExistFile } from './utils';
import getUserConfig from './getUserConfig'
import rollup from './rollup';
import babel from './babel';

export function getBundleOpts(options: IOpts): IBundleOptions[] {
  const { cwd, buildArgs = {}, rootConfig = {} } = options;

  // 获取入口文件
  const entry = getExistFile({
    cwd,
    // 按顺序检测
    files: ['src/index.tsx', 'src/index.ts', 'src/index.jsx', 'src/index.js'],
    returnRelative: true,
  });
  // 获取文件配置
  const userConfig = getUserConfig({ cwd })
  const userConfigs = Array.isArray(userConfig) ? userConfig : [userConfig];

  return (userConfigs as any).map(userConfig => {
    const bundleOpts = merge(
      {
        entry,
      },
      rootConfig,
      userConfig,
      buildArgs,
    );

    // Support config esm: 'rollup' and cjs: 'rollup'
    if (typeof bundleOpts.esm === 'string') {
      bundleOpts.esm = { type: bundleOpts.esm };
    }
    if (typeof bundleOpts.cjs === 'string') {
      bundleOpts.cjs = { type: bundleOpts.cjs };
    }

    return bundleOpts;
  });


}



export async function build(options: IOpts) {
  const { cwd, watch, rootPath } = options;

  const log = console.log;

  // 获取配置列表 返回数组对象
  const bundleOptsArray = getBundleOpts(options);



  for (const bundleOpts of bundleOptsArray) {

    log(chalk.blue(`清除文件...`));
    rimraf.sync(join(cwd, 'dist'));

    if (bundleOpts.esm) {
      const esm = bundleOpts.esm as IEsm;
      log(`Build esm with ${esm.type}`);
      const importLibToEs = esm && esm.importLibToEs;
      if (esm && esm.type === 'babel') {
        await babel({ cwd, rootPath, watch, type: 'esm', importLibToEs, log, bundleOpts });
      } else {
        await rollup({
          cwd,
          log,
          type: 'esm',
          entry: bundleOpts.entry,
          importLibToEs,
          watch,
          bundleOpts,
        });
      }
    }

     // Build cjs
  if (bundleOpts.cjs) {
    const cjs = bundleOpts.cjs as IBundleTypeOutput;
    log(`Build cjs with ${cjs.type}`);
    if (cjs.type === 'babel') {
      await babel({ cwd, rootPath, watch, type: 'cjs', log, bundleOpts });
    } else {
      await rollup({
        cwd,
        log,
        type: 'cjs',
        entry: bundleOpts.entry,
        watch,
        bundleOpts,
      });
    }
  }

  }

 

}

export default async function(opts: IOpts) {
  console.log(1)
  await build(opts);
}
