var express = require('express');
var config = require('./config/index');
var port = process.env.PORT || config.build.PORT;// 当前环境变量下的port或者是
// 在config的index.js中的build添加port: 9000,
var app = express(); // 启动express
var router = express.Router();
// 定义路由
router.get('/', function (req, res, next) {
  req.url = '/index.html';
  next();
});
app.use(router);
// 定义异步接口的router
// 在webpack.dev.conf.js中，拷贝过来
var appData = require('./data.json');//加载本地数据文件
var seller = appData.seller;//获取对应的本地数据
var goods = appData.goods;
var ratings = appData.ratings;
var apiRoutes = express.Router();
apiRoutes.get('/api/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller
  });
});
apiRoutes.get('/api/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  });
});
apiRoutes.get('/api/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  });
});
app.use('/api', apiRoutes);
// 定义static目录
app.use(express.static('./dist'));
// 启动express
// 在webpack.dev.conf.js中，拷贝过来

// module.exports = new Promise((resolve, reject) => {
//   portfinder.basePort = process.env.PORT || config.dev.port;
//   portfinder.getPort((err, port) => {
//     if (err) {
//       reject(err)
//     } else {
//       // publish the new Port, necessary for e2e tests
//       process.env.PORT = port;
//       // add port to devServer config
//       devWebpackConfig.devServer.port = port;
//
//       // Add FriendlyErrorsPlugin
//       devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//         compilationSuccessInfo: {
//           messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
//         },
//         onErrors: config.dev.notifyOnErrors
//           ? utils.createNotifierCallback()
//           : undefined
//       }));
//       resolve(devWebpackConfig)
//     }
//   })
// });
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('listening at http://localhost:9000');
});
