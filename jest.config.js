module.exports = {
  preset: 'ts-jest',
  transform: { '^.+\\.ts?$': 'babel-jest' },
  testEnvironment: 'node',
  testRegex: '/test/unit/.*\\.(spec)?\\.(ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
