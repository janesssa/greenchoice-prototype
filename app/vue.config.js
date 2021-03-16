module.exports = {
    devServer: {
        port: 8080,
        watchOptions: {
            poll: true,
        },
        proxy: {
            '^/api': {
                target: 'http://proxy:3000',
                changeOrigin: true
            },
        }
    }
}