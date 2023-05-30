import { message, danger, fail, warn } from 'danger'

// Setup
const pr = danger.github.pr
const modified = danger.git.modified_files
const reviewers = danger.github.requested_reviewers.users

// Rules

// Ensure Jira ticket is provided
if (!pr.body.includes('https://you-domain.atlassian.net/browse/XXX-')) {
  fail('Please add Jira ticket to your PR.')
}

// Ensure prefix on PR title
if (!pr.title.match(/^\[(Bugfix|Feature|Hotfix|Refactor)\]\s\S.*$/)) {
  fail('Please fix the PR title.')
}

// Ensure PRs have assignees
if (pr.assignee === null) {
  fail('Please assign someone to merge this PR.')
}

// Ensure that we have at least two reviwers
if (reviewers.length < 2) {
  fail('Please add at least two reviewers.')
}

// Add a CHANGELOG entry for app changes
const hasChangelog = modified.includes('changelog.md')
const isTrivial = (pr.body + pr.title).includes('#trivial')

if (!hasChangelog && !isTrivial) {
  fail('Please add a changelog entry for your changes.')
}

// Keep Lockfile up to date
const packageChanged = modified.includes('package.json')
const lockfileChanged = modified.includes('yarn.lock')
if (packageChanged && !lockfileChanged) {
  const message = 'Changes were made to package.json, but not to yarn.lock'
  const idea = 'Perhaps you need to run `yarn install`?'
  warn(`${message} - <i>${idea}</i>`)
}

// Encourage more testing
const hasAppChanges = modified.length > 0

const testChanges = modified.filter((filepath) => filepath.includes('test'))
const hasTestChanges = testChanges.length > 0

if (hasAppChanges && !hasTestChanges) {
  warn(
    "There are library changes, but not tests. That's OK as long as you're refactoring existing code"
  )
}

const modifiedMD = modified.join('- ')
message('Changed Files in this PR: \n - ' + modifiedMD)
