module.exports =

  run: (options) ->

    if options
      require('tb').load options

    { RepoCollection } = require 'ks/github/models/repo'

    ReposView = require 'ks/github/views/repos'

    repos = new RepoCollection

    reposView = new ReposView
      collection: repos

    reposView.el.open()

    repos.fetch()
