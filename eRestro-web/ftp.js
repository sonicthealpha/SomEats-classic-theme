var Deploy = require("ftp-deploy");
var ftpDeploy = new Deploy();

/* 
  This helps you automatically deploy your site on your server with just one command
  you can configure with your FTP settings and start using it.
  It will upload in the root folder of your server i.e, "/"
*/

var config = {
  host: "xxxxxxxxxxxxxxxxxxxx", // give your FTP host name
  user: "xxxxxxxxxxxxxxxxxxxxxxx", // give your FTP username
  password: "xxxxxxxxxxxxxxxxxxxx", // give your FTP password
  port: 21, // change this to 22 or anything else only if you are using SFTP or something else
  localRoot: __dirname + "/build",
  remoteRoot: "/",
  include: ["*", ".htaccess"],
  exclude: ["images/**", ".htaccess"],
  deleteRemote: false,
};
ftpDeploy.deploy(config, function (err, res) {
  if (err) console.log(err);
  else console.log("finished:", res);
});
ftpDeploy.on("uploading", function (data) {
  data.totalFilesCount;
  data.transferredFileCount;
  data.filename;
});
ftpDeploy.on("uploaded", function (data) {
  console.log(data);
});
ftpDeploy.on("log", function (data) {
  console.log(data);
});
ftpDeploy.on("upload-error", function (data) {
  console.log(data.err);
});
