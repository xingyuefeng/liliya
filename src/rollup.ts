import { ModuleFormat, rollup, watch } from 'rollup';
import signale from 'signale';
import { IBundleOptions } from './types';
import normalizeBundleOpts from './normalizeBundleOpts';
import getRollupConfig from './getRollupConfig';

interface IRollupOpts {
  cwd: string;
  entry: string | string[];
  type: ModuleFormat;
  log: (string) => void;
  bundleOpts: IBundleOptions;
  watch?: boolean;
  importLibToEs?: boolean;
}


async function build(entry: string, opts: IRollupOpts) {
  const { cwd, type, log, bundleOpts, importLibToEs } = opts;
  // 整理参数
  const rollupConfigs = getRollupConfig({
    cwd,
    type,
    entry,
    importLibToEs,
    bundleOpts: normalizeBundleOpts(entry, bundleOpts),
  });

  for (const rollupConfig of rollupConfigs) {
    if (opts.watch) {
      const watcher = watch([
        {
          ...rollupConfig,
          watch: {},
        },
      ]);
      watcher.on('event', (event: any) => {
        if (event.error) {
          signale.error(event.error);
        } else if (event.code === 'START') {
          log(`[${type}] 文件更改重新编译...`);
        }
      });
      process.once('SIGINT', () => {
        watcher.close();
      });
    } else {
      const { output, ...input } = rollupConfig;
      const bundle = await rollup(input);
      await bundle.write(output);
    }
  }

}





export default async function(opts: IRollupOpts) {
  if (Array.isArray(opts.entry)) {
    const { entry: entries } = opts;
    // 多入口
    for (const entry of entries) {
      await build(entry, opts);
    }
  } else {
    await build(opts.entry, opts);
  }
}
