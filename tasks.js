const { copyFiles, deleteFoldersRecursive, npmInstall, buildReact } = require('@iobroker/build-tools');

const SRC = 'src-widgets/';
const src = `${__dirname}/${SRC}`;
const adapterName = require('./package.json').name.replace('iobroker.', '');

function clean() {
  deleteFoldersRecursive(`${src}build`);
  deleteFoldersRecursive(`${__dirname}/widgets`);
}

function copyAllFiles() {
  copyFiles([`${SRC}build/customWidgets.js`], `widgets/${adapterName}`);
  copyFiles([`${SRC}build/assets/*.*`], `widgets/${adapterName}/assets`);
  copyFiles([`${SRC}build/img/*.*`], `widgets/${adapterName}/img`);
  copyFiles([`${SRC}build/i18n/*.json`], `widgets/${adapterName}/i18n`);
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
