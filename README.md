# shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui, nextjs app and nestjs app.

## Usage

```bash
pnpm run dev
```

## Contracts build & artifacts

This repo compiles Solidity contracts under `packages/contracts` and produces JSON artifacts. To make those artifacts available to tooling under `tools/`, we provide a small sync script that copies selected `.json` files into `tools/artifacts`.

Common commands from the repo root:

- Compile only (in `packages/contracts`):

```bash
pnpm run contracts:compile
```

- Sync compiled artifacts into `tools/artifacts` (no-op if nothing new):

```bash
pnpm run sync:artifacts
```

- Compile then sync in one step:

```bash
pnpm run contracts:compile:sync
```

About the sync script `tools/scripts/sync-artifacts.js`:

- `--dry` : dry-run, prints what would be copied without writing files
- `--preserve` : preserve the source directory structure under the destination
- `--only=NAME,NAME` : copy only the named artifact basenames (defaults to AppRegistry, RewardManagement, RewardToken, RewardManagementFactory)
- The script ignores `*.dbg.json` files and will print when it overwrites an existing file

## Adding libraries

- Create package.json as show in sdk folder (Change the name as required)
  - Take note of the following. These are what gets imported in the applications.

```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

- Copy the tsconfig.json as shown (Add compilerOption as required)

- Inside src folder, write your own logic.

NOTE:

- DONOT PLAY WITH ESLINT-CONFIG and TYPESCRIPT-CONFIG

## Deploying NPM libraries

- We are using changeset to manage the version management for packages.

- Login into npm from CLI

- Make appropriate changes to the packages. Donot update the version in the packages.

- Mark `private: true` in package.json if you don't want to publish packages in npm.

-- Then read the following doc to get familiar with [changeset](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md). This will help you to release the packages.
