const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const DEFAULT_SRC = path.join(
  root,
  'packages',
  'contracts',
  'build',
  'artifacts',
  'src',
  'contracts',
);
const DEFAULT_DEST = path.join(root, 'tools', 'artifacts');

const args = process.argv.slice(2).reduce(
  (acc, a, i, arr) => {
    if (a === '--dry') acc.dry = true;
    else if (a === '--preserve') acc.preserve = true;
    else if (a === '--help' || a === '-h') acc.help = true;
    else if (a.startsWith('--src=')) acc.src = a.split('=')[1];
    else if (a.startsWith('--dest=')) acc.dest = a.split('=')[1];
    else if (a.startsWith('--only=')) acc.only = a.split('=')[1];
    else if (a === '--src') acc.src = arr[i + 1];
    else if (a === '--dest') acc.dest = arr[i + 1];
    else if (a === '--only') acc.only = arr[i + 1];
    return acc;
  },
  {
    src: undefined,
    dest: undefined,
    dry: false,
    preserve: false,
    only: null,
    help: false,
  },
);

if (args.help) {
  console.log(
    'Usage: sync-artifacts [--src <path>] [--dest <path>] [--dry] [--preserve] [--only=A,B]',
  );
  process.exit(0);
}

const SRC = args.src || DEFAULT_SRC;
const DEST = args.dest || DEFAULT_DEST;
const { dry, preserve, only } = args;

const DEFAULT_ALLOWED = new Set([
  'AppRegistry',
  'RewardManagement',
  'RewardToken',
  'RewardManagementFactory',
]);
const allowed = only
  ? new Set(
      String(only)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    )
  : DEFAULT_ALLOWED;

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((d) =>
      d.isDirectory()
        ? walk(path.join(dir, d.name))
        : d.isFile() && d.name.endsWith('.json')
          ? [path.join(dir, d.name)]
          : [],
    );
}

if (!fs.existsSync(SRC)) {
  console.error('Source not found:', SRC);
  process.exit(1);
}
fs.mkdirSync(DEST, { recursive: true });

const files = walk(SRC);
let copied = 0;
for (const f of files) {
  const b = path.basename(f);
  if (b.endsWith('.dbg.json')) continue;
  const name = b.replace(/\.json$/i, '');
  if (!allowed.has(name)) continue;
  const outRel = preserve ? path.relative(SRC, f) : b;
  const out = path.join(DEST, outRel);
  if (dry) {
    console.log('[DRY]', f, '->', out);
    copied++;
    continue;
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (fs.existsSync(out)) console.log('Overwriting', out);
  fs.copyFileSync(f, out);
  copied++;
}
console.log(`Copied ${copied} files to ${DEST}`);
