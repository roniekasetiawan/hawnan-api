/** @type {import('release-it').Config} */
module.exports = {
  git: {
    tag: true,
    tagName: "v${version}",
    commitMessage: "chore(release): v${version}",
    requireCleanWorkingDir: true
  },
  hooks: {
    "before:init": ["bun test"],
    "after:bump": ["npx auto-changelog -p || echo 'skip changelog'"]
  },
  plugins: {
    "@release-it/conventional-changelog": {
      preset: "conventionalcommits",
      infile: "CHANGELOG.md"
    }
  }
};
