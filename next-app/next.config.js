module.exports = {
    api: {
        bodyParser: false,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: {
                test: /\.(js|ts)x?$/,
            },
            use: ['@svgr/webpack'],
        });

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