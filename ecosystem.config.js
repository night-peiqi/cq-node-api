module.exports = {
  apps: [
    {
      name: 'cq-node-api',
      script: 'dist/main.js',
      watch: false,
      env_production: {
        NODE_ENV: 'production'
      },
      env_test: {
        NODE_ENV: 'test'
      },
      env_development: {
        NODE_ENV: 'development'
      },
      log_type: 'json',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '/www/webroot/cq-node-api/logs/err.log',
      out_file: '/www/webroot/cq-node-api/logs/out.log'
    }
  ]
}
