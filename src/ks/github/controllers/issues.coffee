Chaplin = require 'chaplin'

{ RepoCollection } = require 'ks/github/models/repo'

RepoView = require 'ks/github/views/repos/repo'
ReposView = require 'ks/github/views/repos'

module.exports = class IssuesController extends Chaplin.Controller

  index: ->

    repos = new RepoCollection

    @view = new ReposView
      collection: repos

    repos.fetch()

  show: (params, options) ->

    @view = new RepoView
      model: options.model
