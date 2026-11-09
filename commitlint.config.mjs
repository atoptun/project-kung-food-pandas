export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'chore', 'refactor', 'test', 'ci', 'perf', 'revert'],
    ],
    'scope-empty': [2, 'never'],
    'scope-enum': [2, 'always', ['api', 'web', 'shared', 'docs', 'repo', 'ci']],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
  },
};
