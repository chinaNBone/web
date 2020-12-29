#!/usr/bin/env node

// "nodegit": "^0.24.0",

const { spawn } = require("child_process");
const SSH2 = require("ssh2").Client,
  gitInfo = require("./git"),
  logs = require("./logs"),
  moment = require("moment"),
  fs = require("fs"),
  glob = require("glob"),
  path = require("path"),
  AdmZip = require("adm-zip"),
  appinfo = require("../package.json"),
  program = require("commander");

const conn = new SSH2();

const DefOpts = {
  shell: true, // 需要指定shell
  stdio: "inherit" // 使用原有输出到控制台
};

const regConfig = {
  test: {
    host: "106.14.202.19",
    port: 22,
    username: "root",
    password: "XueNeng5404",
    dir: "/home/xueneng/web/moocNew/manager",
    dist: "/dist",
    backup: "/backup"
  },
  prod: {
    host: "59.111.94.230",
    port: 22,
    username: "root",
    key: "F:\\sshkey\\mooc-new-netcloud",
    dir: "/home/cmamooc/web/moocNew/manager",
    dist: "/dist",
    backup: "/backup"
  }
};

let appName = appinfo.name;
let version = "v1.0";
let mode, dist, filename, sconfig;
let opts = {
  main: false,
  omit: false,
  clean: false
};
let optinfo = "";

let auth = {
  username: "",
  port: 22,
  host: ""
};

// 开始任务
start();

function start() {
  if (!handleScript()) {
    return;
  }
  logs.stage("开始任务");
  buildProject(code => {
    startSSH();
  });
}

function handleScript() {
  program
    .command("push <env>")
    .description("上传镜像到指定环境")
    // 大版本使用
    .option("-c, --clean", "清除backup中所有的旧文件")
    // 大版本使用
    .option("-m, --main", "tag不使用随机信息后缀，直接使用version参数的版本号")
    // 跳过编译
    .option("-o, --omit", "跳过build，即不使用npm run build/test")
    .action(function(env, cmd) {
      mode = env || "test";
      initOption(cmd);
    });
  // .parse(process.argv);
  program.parse(process.argv);
  if (!config()) {
    logs.error(`无效的上传环境 ${mode}`);
    return false;
  }
  return true;
}

function initOption(cmd) {
  for (let key in opts) {
    let tp = (opts[key] = cmd[key]);
    if (typeof tp === "boolean" && tp) {
      optinfo += `, <${key}>`;
    } else if (tp) {
      optinfo += `, <${key} -- ${tp}>`;
    }
  }
  if (optinfo.length > 0) {
    optinfo = optinfo.substr(2);
  }
}

function config() {
  logs.stage("初始化配置信息");
  logs.info(`上传环境 <${mode}>`);
  let conf = regConfig[mode];
  if (!conf) {
    return false;
  }
  logs.info(`已选配置 ${optinfo || "无"}`);
  conf.dist = conf.dir + conf.dist;
  conf.backup = conf.dir + conf.backup;
  sconfig = conf;

  // 镜像空间配置
  auth = {
    username: conf.username,
    host: conf.host,
    port: conf.port
  };
  if (conf.password) {
    auth.password = conf.password;
  } else {
    auth.privateKey = fs.readFileSync(conf.key);
  }

  return true;
}

function buildProject(callback) {
  if (opts.omit) {
    typeof callback === "function" && callback();
    return;
  }
  runcmd(
    "npm",
    ["run", mode],
    {
      cwd: path.join(__dirname, "../")
    },
    code => {
      if (code == 0) {
        logs.info("project build completed!\n");
        typeof callback === "function" && callback(code);
      } else {
        logs.error("project build faild!");
      }
    }
  );
}

function runcmd(cmd, args, option, callback) {
  if (typeof option === "function") {
    callback = option;
    option = DefOpts;
  } else {
    option = Object.assign({}, DefOpts, option);
  }

  const build = spawn(cmd, args, option);

  build.on("close", code => {
    logs.done(`child process exited with code ${code}`);
    typeof callback === "function" && callback(code);
  });
}

function startSSH() {
  useGitInfo()
    .then(() => {
      initSSH();
    })
    .catch(err => {
      logs.error(err);
    });
}

function getDate() {
  return moment().format("YYMMDDHHmm");
}

function useGitInfo() {
  logs.stage("获取git信息");
  return gitInfo
    .getLastCommit()
    .then(info => {
      let date = getDate();
      if (opts.main) {
        version = `${version}`;
      } else {
        version = `${version}-${date}-${info.id}-${info.user}`;
      }
      logs.info(
        `当前版本信息  <user -- ${info.user}>  <version -- ${version}>\n`
      );
    })
    .catch(err => {
      logs.error(err);
    });
}

function getZipName(t) {
  filename = `${appName}${t ? "-" : ""}${t}.zip`;
  return path.join(__dirname, `${filename}`);
}

function createDistZip() {
  logs.stage("创建临时dist zip文件");
  removeDistZip();
  dist = getZipName(version);
  let zip = new AdmZip();
  zip.addLocalFolder(path.join(__dirname, "../dist"), "dist");
  zip.writeZip(dist);

  // 重命名，防止build缓存
  // let stats = fs.statSync(dist);
  // fs.renameSync(dist, (dist = getZipName(stats.size)));
  logs.info(`临时dist zip文件 <${dist}>`);
}

function removeDistZip() {
  try {
    let files = glob.sync(path.join(__dirname, `${appName}*.zip`));
    if (files.length !== 0) {
      for (let entry of files) {
        logs.done("delete", entry);
        fs.unlink(entry, err => {
          if (err) throw err;
        });
      }
    }
  } catch (e) {
    logs.error(e);
  }
}

function initSSH() {
  logs.stage("创建压缩文件");
  // 文件夹需要使用压缩方式上传，不然权限会在copy时重新赋予，导致静态文件无法被nginx访问
  createDistZip();
  logs.stage(`连接到服务器 ${auth.host}:${auth.port}`);
  conn
    .on("ready", function() {
      logs.done("服务器连接成功");
      conn.shell(function(err, stream) {
        if (err) throw err;
        stream
          .on("close", function() {
            logs.done("初始化文件完成");
            uploadFile();
          })
          .on("data", function(data) {
            console.log("OUTPUT: " + data);
          });
        logs.stage("初始化文件");
        let clean = opts.clean ? `rm -rf ${sconfig.backup}\n` : "";
        stream.end(
          `mkdir -p ${sconfig.dist}\nmkdir -p ${sconfig.backup}\n${clean}exit\n`
        );
      });
    })
    .connect(auth);
}

function close() {
  logs.stage("关闭远程连接");
  conn.end();
  logs.done("部署完成");
}

function uploadFile() {
  logs.stage("上传压缩文件");
  conn.sftp(function(err, sftp) {
    if (err) throw err;
    sftp.fastPut(dist, `${sconfig.backup}/temp.zip`, function(err) {
      if (err) throw err;
      // 上传成功
      logs.done("上传压缩文件成功！");
      logs.info("清除临时dist zip文件");
      removeDistZip();
      deployFile();
    });
  });
}

function deployFile() {
  logs.stage("部署服务文件");
  conn.shell(function(err, stream) {
    if (err) throw err;
    stream
      .on("close", function() {
        logs.done("部署服务文件成功！");
        close();
      })
      .on("data", function(data) {
        console.log("OUTPUT: " + data);
      });
    stream.end(
      `rm -rf ${sconfig.dist}\nrm -rf ${sconfig.backup}/${appName}*.zip\nunzip ${sconfig.backup}/temp.zip -d ${sconfig.dir}\nmv ${sconfig.backup}/temp.zip ${sconfig.backup}/${filename}\nexit\n`
    );
  });
}
