module.exports = {
  apps: [{
    name: 'cms',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-35-154-248-244.ap-south-1.compute.amazonaws.com',
      ref: 'origin/master',
      repo: 'git@github.com:Sundarasan/cms.git',
      path: '/home/ubuntu/cms',
      'post-deploy': 'yarn install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
