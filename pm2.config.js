module.exports = {
    apps: [
        {
            name: 'helper',
            script: 'build/index.js',
            node_args: '-r dotenv/config',
        },
    ],
}
