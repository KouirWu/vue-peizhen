// ESLint配置文件 - 禁用所有ESLint规则
module.exports = {
  // 指定环境
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  // 继承推荐配置
  extends: [
    'eslint:recommended'
  ],
  // 解析器选项
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  // 禁用所有规则
  rules: {
    // 关闭所有ESLint规则
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-debugger': 'off'
  },
  // 忽略所有文件的检查
  ignorePatterns: [
    '**/*'
  ]
};