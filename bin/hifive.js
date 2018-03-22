#!/usr/bin/env node

const program = require('commander');
const hifive = require('../src/hifive');

program
  .command('init <dir>')
  .action((dir) => {
    hifive.init(dir)
      .then(() => console.log('生成しました'))
  })

program.parse(process.argv);

