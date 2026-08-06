/**
 * Metro breaks on package "react-native" fields that end in `.native.js`
 * (resolves as index.native.js + platform extensions). Point them at
 * extension-free shims instead.
 */
const fs = require('fs');
const path = require('path');

const patches = [
  {
    pkg: '@solana-mobile/mobile-wallet-adapter-protocol-web3js',
    shims: [
      {
        file: 'lib/cjs/rn.js',
        body: "module.exports = require('./index.native.js');\n",
        field: 'lib/cjs/rn.js',
      },
    ],
  },
  {
    pkg: '@solana-mobile/mobile-wallet-adapter-protocol',
    shims: [
      {
        file: 'lib/cjs/rn.js',
        body: "module.exports = require('./index.native.js');\n",
        field: 'lib/cjs/rn.js',
      },
      {
        file: 'lib/cjs/encoding.rn.js',
        body: "module.exports = require('./encoding.native.js');\n",
        field: null,
      },
    ],
  },
];

for (const { pkg, shims } of patches) {
  const root = path.join(__dirname, '..', 'node_modules', pkg);
  const pkgJsonPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    console.warn(`[patch-mwa-metro] skip missing ${pkg}`);
    continue;
  }

  for (const shim of shims) {
    const shimPath = path.join(root, shim.file);
    fs.mkdirSync(path.dirname(shimPath), { recursive: true });
    fs.writeFileSync(shimPath, shim.body);
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  pkgJson['react-native'] = 'lib/cjs/rn.js';
  if (pkgJson.exports) {
    if (pkgJson.exports['.']) {
      pkgJson.exports['.']['react-native'] = './lib/cjs/rn.js';
    } else if (pkgJson.exports['react-native']) {
      pkgJson.exports['react-native'] = './lib/cjs/rn.js';
    }
    if (pkgJson.exports['./encoding']) {
      pkgJson.exports['./encoding']['react-native'] =
        './lib/cjs/encoding.rn.js';
    }
  }
  fs.writeFileSync(pkgJsonPath, `${JSON.stringify(pkgJson, null, 2)}\n`);
  console.log(`[patch-mwa-metro] patched ${pkg}`);
}
