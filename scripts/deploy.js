import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { publish } from 'gh-pages'

function git(command) {
  return execSync(command, { encoding: 'utf8' }).trim()
}

function githubOrigin() {
  const remote = git('git remote get-url origin')
  const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+?)(?:\.git)?$/i)

  if (!match) {
    throw new Error(`Could not read a GitHub owner/repo from origin: ${remote}`)
  }

  return { owner: match[1], repo: match[2] }
}

function pagesBase(repo) {
  if (repo.endsWith('.github.io')) {
    return '/'
  }

  return `/${repo}/`
}

const { owner, repo } = githubOrigin()
const base = process.env.VITE_BASE || pagesBase(repo)

console.log(`Building for GitHub Pages at base ${base}`)

execSync('npm run build', {
  stdio: 'inherit',
  env: { ...process.env, VITE_BASE: base },
})

writeFileSync('dist/.nojekyll', '')

const dirty = git('git status --porcelain')
if (dirty) {
  console.warn(
    'You have uncommitted changes. Deploy still publishes the current build; commit separately if you want the source saved on GitHub.',
  )
}

console.log('Publishing dist/ to the gh-pages branch...')

await new Promise((resolve, reject) => {
  publish(
    'dist',
    {
      branch: 'gh-pages',
      message: 'Deploy to GitHub Pages',
      dotfiles: true,
      history: false,
    },
    (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    },
  )
})

console.log('Deployed. GitHub Pages usually updates within a minute.')
console.log(`Site: https://${owner}.github.io${base === '/' ? '/' : base}`)
