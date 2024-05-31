'use strict';

const fs = require('fs');
const path = require('path');
const logger = require('./app/utils/logger');

let rootPath = 'coverage/';

let data = fs.readFileSync(
  path.resolve('./coverage/coverage-summary.json'),
  'utf8'
);
let webData = fs.readFileSync(
  path.resolve('./web/coverage/coverage-summary.json'),
  'utf8'
);
data = JSON.parse(data).total;
webData = JSON.parse(webData).total;
// const data = {
//     "coverage_pct": 80.51,
//     "lines_total": 10038,
//     "lines_covered": 5171,
//     "branch_pct": 32.04,
//     "branches_covered": 1655,
//     "branches_total": 5166
//  }

// let output = data;
// let output = {
//     coverage_pct: (data.lines.pct + webData.lines.pct)/2,
//     lines_total: data.lines.total + webData.lines.total,
//     lines_covered: data.lines.covered + webData.lines.covered,
//     branch_pct: (data.branches.pct + webData.branches.pct)/2,
//     branches_covered: data.branches.covered + webData.branches.covered,
//     branches_total: data.branches.total + webData.branches.total,
// }

let output = {
  coverage_pct: data.lines.pct,
  lines_total: data.lines.total,
  lines_covered: data.lines.covered,
  branch_pct: data.branches.pct,
  branches_covered: data.branches.covered + data.branches.covered,
  branches_total: data.branches.total + data.branches.total,
};

// let output = {
//   coverage_pct: webData.lines.pct,
//   lines_total: webData.lines.total,
//   lines_covered: webData.lines.covered,
//   branch_pct: (data.branches.pct + webData.branches.pct) / 2,
//   branches_covered: data.branches.covered + webData.branches.covered,
//   branches_total: data.branches.total + webData.branches.total,
// };

console.log('Coverage Output : ', output);
output = JSON.stringify(output, null, 2);
fs.writeFileSync(path.join(rootPath, 'coverage_output.json'), output, 'utf8');
logger.info('dumped coverage_output.json');
