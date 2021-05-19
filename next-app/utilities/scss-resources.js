const path = require('path');

const resources = [
  'styles/theme.scss'
];
module.exports = resources.map(file => path.resolve(__dirname, file));