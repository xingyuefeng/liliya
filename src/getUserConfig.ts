import AJV from 'ajv'
import { relative } from "path";
import slash from "slash2";
import { getExistFile } from './utils'
import schema from './schema'

function testDefault(obj) {
  return obj.default || obj;
}

export const CONFIG_FILES = [
  ".liliya.js",
  ".liliya.jsx",
  ".liliya.ts",
  ".liliya.tsx",
];

export default function({ cwd }) {
  const configFile = getExistFile({
    cwd,
    files: CONFIG_FILES,
    returnRelative: false,
  });

  if (configFile) {
    const userConfig = testDefault(require(configFile));
    const userConfigs = Array.isArray(userConfig) ? userConfig : [userConfig];
    // 检验配置合法性
    userConfigs.forEach((userConfig) => {
      const ajv = new AJV({ allErrors: true })
      const isValid = ajv.validate(schema, userConfig);
      if (!isValid) {
        const errors = ajv.errors.map(({ dataPath, message }, index) => {
          return `${index + 1}. ${dataPath}${dataPath ? " " : ""}${message}`;
        });
        throw new Error(
          `
            非法参数在 ${slash(relative(cwd, configFile))}

            ${errors.join("\n")}
            `.trim()
        );
      }
    })
    return userConfig
  } else {
    return {}
  }

}