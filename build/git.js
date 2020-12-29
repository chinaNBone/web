;
let git = require('nodegit'),
  path = require("path");

function openGit() {
  return git.Repository.open(path.resolve(__dirname, "../.git"));
}

function getLastCommit() {
  let branch, user;
  return openGit()
    .then(function (repo) {
      // 获取当前branch名称
      user = repo.defaultSignature().name();
      repo.getCurrentBranch().then(ref => {
        branch = ref.name();
      }).done();
      return repo.getHeadCommit();
    })
    .then(function (commit) {
      console.log("\n当前打包git版本信息\n");
      console.log("branch:\t", branch);
      console.log("commit:\t", commit.sha());
      console.log("Author:\t", commit.author().name() +
        " <" + commit.author().email() + ">");
      console.log("Date:\t", commit.date());
      console.log("\n    " + commit.message());
      return {
        branch: branch,
        id: commit.sha().substr(0, 8),
        user: user,
        commitAuthor: commit.author().name(),
        date: commit.date()
      }
    }).catch(err => {
      console.log(err)
    })
}

function showCommitHistory() {
  openGit()
    .then(function (repo) {
      return repo.getHeadCommit();
    })
    .then(function (firstCommitOnHead) {
      // History returns an event.
      var history = firstCommitOnHead.history(git.Revwalk.SORT.TIME);

      // 获取历史提交记录
      history.on("commit", function (commit) {
        console.log("commit " + commit.sha());
        console.log("Author:", commit.author().name() +
          " <" + commit.author().email() + ">");
        console.log("Date:", commit.date());
        console.log("\n    " + commit.message());
      });

      // 必须调用start()方法才能开始遍历历史记录
      history.start();
    })
    .catch(err => {
      console.log(err)
    })
    .done();
}

module.exports = {
  getLastCommit,
  showCommitHistory
}