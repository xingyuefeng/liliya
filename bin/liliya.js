#!/usr/bin/env node

const { existsSync } = require('fs');
const { join } = require('path');
const yParser = require('yargs-parser');
const chalk = require('chalk');
const signale = require('signale');

// print version and @local
const args = yParser(process.argv.slice(2));

// console.log(args)

function stripEmptyKeys(obj) {
  Object.keys(obj).forEach((key) => {
    if (!obj[key] || (Array.isArray(obj[key]) && !obj[key].length)) {
      delete obj[key];
    }
  });
  return obj;
}

function build() {
  // 整理过滤命令行参数
  const buildArgs = stripEmptyKeys({
    // 默认rollup 可以babel
    esm: args.esm && { type: args.esm === true ? 'rollup' : args.esm },
    cjs: args.cjs && { type: args.cjs === true ? 'rollup' : args.cjs },
    umd: args.umd && { name: args.umd === true ? undefined : args.umd },
    // 指定输出文件
    file: args.file,
    // 配置是 node 库还是 browser 库
    target: args.target,
    // 支持多入口
    entry: args._,
  })

  if (buildArgs.file && buildArgs.entry && buildArgs.entry.length > 1) {
    signale.error(new Error(
      `多入口的时候无法指定单个文件 (${buildArgs.entry.join(', ')})`
    ));
    process.exit(1);
  }

  require('../lib/build').default({
    cwd: args.root || process.cwd(),
    watch: args.w || args.watch,
    buildArgs
  }).catch(e => {
    signale.error(e);
    process.exit(1);
  });


}