class Repo extends Backbone.Model

class RepoCollection extends Backbone.Collection

  model: Repo

  url: 'https://api.github.com/users/trabianmatt/repos'

module.exports = { Repo, RepoCollection }

