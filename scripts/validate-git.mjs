import { execSync } from 'node:child_process';

const BRANCH_REGEX =
  /^(main|develop|(feat|fix|chore|docs|refactor|test|ci|perf)\/(api|web|shared|docs|repo)\/[a-z0-9-]+)$/;

function getCurrentBranch() {
  return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
}

function getStagedFiles() {
  const output = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
  return output ? output.split('\n') : [];
}

const branch = getCurrentBranch();

// Detached HEAD in CI or rebase should not fail branch name validation
if (branch !== 'HEAD' && !BRANCH_REGEX.test(branch)) {
  console.error(
    `\n[Git Policy] Invalid branch name: "${branch}".\n` +
      'Expected format: <type>/<scope>/<short-kebab-description>\n' +
      'Allowed types:   feat, fix, chore, docs, refactor, test, ci, perf\n' +
      'Allowed scopes:  api, web, shared, docs, repo\n' +
      'Examples:\n' +
      '  - feat/api/auth-refresh-token\n' +
      '  - fix/web/user-profile-query\n' +
      '  - chore/shared/update-zod-schemas\n',
  );
  process.exit(1);
}

const stagedFiles = getStagedFiles();
const touchesApi = stagedFiles.some((file) => file.startsWith('apps/api/'));
const touchesWeb = stagedFiles.some((file) => file.startsWith('apps/web/'));
const isRepoScopeBranch = branch.includes('/repo/');

// Prevent mixing backend and frontend changes within a single commit (unless on a `*/repo/*` branch)
if (touchesApi && touchesWeb && !isRepoScopeBranch) {
  console.error(
    '\n[Git Policy] Cannot mix changes from "apps/api/" and "apps/web/" in a single commit.\n' +
      'Please stage and commit backend and frontend changes separately (or use a <type>/repo/<name> branch).\n',
  );
  process.exit(1);
}
