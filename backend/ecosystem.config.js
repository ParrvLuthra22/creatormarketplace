/**
 * PM2 Ecosystem Configuration
 * 
 * Production process manager config for the backend server.
 * 
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 stop creator-marketplace-api
 *   pm2 restart creator-marketplace-api
 *   pm2 logs creator-marketplace-api
 */

module.exports = {
    apps: [
        {
            name: 'creator-marketplace-api',
            script: './dist/server.js',
            cwd: __dirname,
            instances: 'max', // Use all available CPU cores
            exec_mode: 'cluster',

            // Environment variables
            env: {
                NODE_ENV: 'development',
                PORT: 5001,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5001,
            },

            // Logging
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            error_file: './logs/error.log',
            out_file: './logs/output.log',
            merge_logs: true,

            // Auto-restart settings
            watch: false, // Disabled in production
            max_memory_restart: '500M',
            restart_delay: 3000,

            // Graceful shutdown
            kill_timeout: 5000,
            wait_ready: true,
            listen_timeout: 10000,

            // Health monitoring
            min_uptime: '10s',
            max_restarts: 10,
        },
    ],
};
