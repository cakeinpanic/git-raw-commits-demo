const gitRawCommits = require('git-raw-commits')
const concat = require('concat-stream')
gitRawCommits({
  format: '%B%H%n',
  from: '1.0.0',
  path: 'folderB'
}).pipe(concat(data => {
  console.log(data.toString());
}))
