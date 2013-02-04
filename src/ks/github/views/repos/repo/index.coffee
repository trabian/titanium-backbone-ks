View = require 'tb/views/base'

module.exports = class RepoView extends View

  tagName: 'Window'

  className: 'github-repo'

  template: require './template'

  attributes: ->
    title: @model.get 'name'
