const chalk = require('chalk')

// chalk.level = 3;

/**
 * log([ bgcolor ], [ tips ], [ false = set font color white], console info)
 * 
 * exp:
 * logs.log(">info", "my console log", "xyz");
 * logs.log("@green", ">info", false, "my console log", "xyz");
 * logs.log("@green", "my console log", "xyz");
 * logs.log("#00ff00", "You can see me.", "xyz");
 * logs.log("!0, 255, 0", "You can see me.", "xyz");
 * logs.done("You can see me.", "xyz");
 * logs.info("You can see me.");
 * logs.error("You can see me.");
 * logs.warn("You can see me.");
 */
const logs = {
  log(keyword, ...args) {
    let tips,
      convert = chalk.blue,
      convertBg = chalk.bgBlue;
    if (typeof keyword === "string") {
      if (/^[\#\@\!].+/.test(keyword)) {
        let key = keyword.substr(0, 1)
        let word = keyword.substr(1)
        switch (key) {
          case "@":
            convert = chalk.keyword(word);
            convertBg = chalk.bgKeyword(word);
            break;
          case "#":
            convert = chalk.hex(keyword);
            convertBg = chalk.bgHex(keyword);
            break;
          case "!":
            rgb = word.replace(/[ ]/g, "").split(",");
            convert = chalk.rgb.apply(chalk, rgb);
            convertBg = chalk.bgRgb.apply(chalk, rgb);
            break;
        }
      } else {
        args.unshift(keyword);
      }
    }
    if (typeof args[0] === "string" && args[0].startsWith(">")) {
      tips = args[0].substr(1);
      if (args[0].startsWith(">>")) {
        tips = tips.substr(1);
        tips = tips.toUpperCase();
      }
      args = args.slice(1);
    }
    args = args[0] === false ? args.slice(1) : args.map(arg => convert(arg));
    args.unshift(convertBg.black(` ${tips||"LOG"} `))
    console.log.apply(null, args)
  },
  info(...args) {
    args = args[0] === false ? args.slice(1) : args.map(arg => chalk.blue(arg));
    args.unshift(chalk.black.bgBlue(" INFO "))
    console.info.apply(null, args)
  },
  stage(...args) {
    args = args[0] === false ? args.slice(1) : args.map(arg => chalk.magenta(arg));
    args.unshift(chalk.black.bgMagenta(" STAGE "))
    console.info.apply(null, args)
  },
  done(...args) {
    args = args[0] === false ? args.slice(1) : args.map(arg => chalk.green(arg));
    args.unshift(chalk.black.bgGreen(" DONE "))
    console.info.apply(null, args)
  },
  error(...args) {
    args = args[0] === false ? args.slice(1) : args.map(arg => chalk.red(arg));
    args.unshift(chalk.black.bgRed(" ERROR "))
    console.error.apply(null, args)
  },
  warn(...args) {
    args = args[0] === false ? args.slice(1) : args.map(arg => chalk.yellow(arg));
    args.unshift(chalk.black.bgYellow(" WARN "))
    console.warn.apply(null, args)
  },
}

function test() {
  // Combine styled and normal strings
  console.log(chalk.blue('Hello') + ' World' + chalk.red('!'));

  // Compose multiple styles using the chainable API
  console.log(chalk.blue.bgRed.bold('Hello world!'));

  // Pass in multiple arguments
  console.log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

  // Nest styles
  console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

  // Nest styles of the same type even (color, underline, background)
  console.log(chalk.green(
    'I am a green line ' +
    chalk.blue.underline.bold('with a blue substring') +
    ' that becomes green again!'
  ));

  // ES2015 template literal
  console.log(`
  CPU: ${chalk.red('90%')}
  RAM: ${chalk.green('40%')}
  DISK: ${chalk.yellow('70%')}
  `);

  // ES2015 tagged template literal
  // console.log(chalk `
  // CPU: {red ${cpu.totalPercent}%}
  // RAM: {green ${ram.used / ram.total * 100}%}
  // DISK: {rgb(255,131,0) ${disk.used / disk.total * 100}%}
  // `);

  // Use RGB colors in terminal emulators that support it.
  console.log(chalk.keyword('orange')('Yay for orange colored text!'));
  console.log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
  console.log(chalk.hex('#DEADED').bold('Bold gray!'));
  console.log('\033[42;30m DONE \033[40;32m Compiled successfully in 19987ms\033[0m')
  console.log(chalk.black.bgGreen(" DONE ") + chalk.green(" Compiled successfully in 19987ms"))

  logs.log(">info", "my console log", "xyz");
  logs.log("@green", ">info", false, "my console log", "xyz");
  logs.log("@green", "my console log", "xyz");
  logs.log("#00ff00", "You can see me.", "xyz");
  logs.log("!0, 255, 0", "You can see me.", "xyz");
  logs.done("You can see me.", "xyz");
  logs.info("You can see me.");
  logs.error("You can see me.");
  logs.warn("You can see me.");
}

module.exports = logs;