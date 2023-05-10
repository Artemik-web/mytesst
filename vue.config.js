module.exports = {
    //解决打包目录错误,
    publicPath: '/',
    // outputDir:'dist',
    // assetsDir:'static',
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        open: true,
        proxy: {
            '/api': {
                open: true,
                target: 'http://localhost:3007',
                // target: 'https://47.115.214.138/api',
                //允许跨域
                changeOrigin: true,
                // 是否代理websocket
                ws: true,
                //3 重写路径
                pathRewrite: {
                    '^/api': 'http://localhost:3007'
                    // '^/api': ''
                }
            }
        }
    }
}