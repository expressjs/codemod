module.exports = {
  automock: false,
  transform: {
    '\\.ts$': ['ts-jest', { isolatedModules: true }],
  },
  modulePathIgnorePatterns: ['<rootDir>/build/'],
}
