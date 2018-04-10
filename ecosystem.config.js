module.exports = {
  apps: [{
    name: 'ec2-sample-express',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-18-219-254-130.us-east-2.compute.amazonaws.com',
      ref: 'origin/master',
      repo: 'git@github.com:Sundarasan/ec2-sample-express.git',
      path: '/home/ubuntu/ec2-sample-express',
      'post-deploy': 'yarn install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
