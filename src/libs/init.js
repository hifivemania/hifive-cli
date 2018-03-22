const path = require('path');
const exec = require('child_process').exec;
const https = require('https');
const fs = require('fs');
const iniparser = require('iniparser');

module.exports = (dir) => {
  const realPath = path.resolve(dir);
  process.cwd(realPath);
  const files = {
    'index.html': 'https://gist.githubusercontent.com/goofmint/4ec751c3c5e420ea02222bd52280ec62/raw/32f135e25b9d6e06d326e8e36b8dd90169ae6f02/index.html',
    '.bowerrc': 'https://gist.githubusercontent.com/goofmint/4ec751c3c5e420ea02222bd52280ec62/raw/895173767569843ef611556d983d00a4641df7a0/.bowerrc',
    'bower.json': 'https://gist.githubusercontent.com/goofmint/4ec751c3c5e420ea02222bd52280ec62/raw/32f135e25b9d6e06d326e8e36b8dd90169ae6f02/bower.json'
  };
  
  return loadConfig()
    .then((config) => downloadFiles(files, realPath, config.user),
      err => console.log(err)
    )
    .then(() => execute(`bower i`),
      err => console.log(err)
    )
}

const loadConfig = () => {
  return new Promise((res, rej) => {
    const home_dir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    const config_file = home_dir+'/.gitconfig';
    try {
      fs.statSync(config_file);
      const config = iniparser.parseSync(config_file);
      res(config);
    }catch(e) {
      rej(e)
    }
  });
}

const download = (filePath, url, user, appName) => {
  return new Promise((res, rej) => {
    const request = https.get(url, (response) => {
      let rawData = '';
      response.on('data', (chunk) => { rawData += chunk; });
      response.on('end', (chunk) => {
        rawData = rawData.replace('__AUTHOR_NAME__', user.name)
          .replace('__AUTHOR_EMAIL__', user.email)
          .replace('__APP_NAME__', appName);
        fs.writeFile(filePath, rawData, (err) => {
          if (err) return rej(err);
          res();
        })
      });
    });    
  })
}

const downloadFiles = (files, realPath, user) => {
  const promises = [];
  const appName = path.dirname(`${realPath}/dummy`).split(path.sep).pop();
  for (let fileName in files) {
    promises.push(
      download(`${realPath}/${fileName}`, files[fileName], user, appName)
    );
  }
  return Promise.all(promises);
};

const execute = (command) => {
  return new Promise((res, rej) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return rej(err, stderr);
      res(stdout);
    })
  });
}