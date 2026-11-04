/* Copies the browser builds of jsPDF and SheetJS into www/vendor so the app
   works offline and does not depend on a CDN at runtime. Runs automatically
   after `npm install`/`npm ci` via the postinstall script. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const vendorDir = path.join(root, 'www', 'vendor');

const libs = [
  { from: path.join('jspdf', 'dist', 'jspdf.umd.min.js'), to: 'jspdf.umd.min.js' },
  { from: path.join('xlsx', 'dist', 'xlsx.full.min.js'), to: 'xlsx.full.min.js' },
];

fs.mkdirSync(vendorDir, { recursive: true });

for (const lib of libs) {
  const src = path.join(root, 'node_modules', lib.from);
  const dst = path.join(vendorDir, lib.to);
  if (!fs.existsSync(src)) {
    console.error(`[vendor] missing ${src}. Run "npm install" first.`);
    process.exit(1);
  }
  fs.copyFileSync(src, dst);
  console.log(`[vendor] ${lib.to}`);
}
