module.exports =

  run: (options) ->

    if options
      require('tb').load options

    GithubApplication = require 'ks/github/application'

    app = new GithubApplication()
    app.initialize()
