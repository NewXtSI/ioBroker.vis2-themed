const { deleteFoldersRecursive, npmInstall, buildReact } = require('@iobroker/build-tools');
const fs = require('node:fs');
const path = require('node:path');

const SRC = 'src-widgets/';
const src = `${__dirname}/${SRC}`;
const adapterName = require('./package.json').name.replace('iobroker.', '');

function copyDirContents(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    return;
  }

  fs.mkdirSync(targetDir, { recursive: true });
  for (const entry of fs.readdirSync(sourceDir)) {
    const sourcePath = path.join(sourceDir, entry);
    const targetPath = path.join(targetDir, entry);
    fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });
  }
}

function clean() {
  deleteFoldersRecursive(`${src}build`);
  deleteFoldersRecursive(`${__dirname}/widgets`);
}

function copyAllFiles() {
  const buildDir = path.join(src, 'build');
  const widgetDir = path.join(__dirname, 'widgets', adapterName);

  deleteFoldersRecursive(widgetDir);
  fs.mkdirSync(widgetDir, { recursive: true });

  fs.cpSync(path.join(buildDir, 'customWidgets.js'), path.join(widgetDir, 'customWidgets.js'), { force: true });
  copyDirContents(path.join(buildDir, 'assets'), path.join(widgetDir, 'assets'));
  copyDirContents(path.join(buildDir, 'img'), path.join(widgetDir, 'img'));
  copyDirContents(path.join(buildDir, 'i18n'), path.join(widgetDir, 'i18n'));
}

if (process.argv.includes('--copy-files')) {
  copyAllFiles();
} else {
  clean();
  const npmPromise = npmInstall(src);
  npmPromise
    .then(() => buildReact(src, { rootDir: __dirname, vite: true }))
    .then(() => copyAllFiles())
    .catch(e => console.error(`Cannot build: ${e}`));
}
