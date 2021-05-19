module.exports = {
    webpack: (config) => {
        return config;
    },
    webpackDevMiddleware: config => {
        config.watchOptions = {
            poll: 1000, // Check for changes every second
            aggregateTimeout: 300 // delay before rebuilding
        };
        return config;
    },
    distDir: ".next",
    sassOptions: {
        additionalData: '@forward "styles/colors";'
    }
};