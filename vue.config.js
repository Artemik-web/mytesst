module.exports = {
     //解决打包目录错误,
    publicPath: "./",
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        open: true,
        proxy: {
            '/api': {
                open: true, 
                target: 'http://47.115.214.138:3007',
                //允许跨域
                changeOrigin: true,
                // 是否代理websocket
                ws: true, 
                //3 重写路径
                pathRewrite: {
                    '^/api': 'http://47.115.214.138:3007'
                }
            }
        }
    }
}