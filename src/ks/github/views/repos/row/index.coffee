View = require 'tb/views/base'

module.exports = class RepoView extends View

  tagName: 'TableViewRow'

  template: require './template'

  events: { 'click' }

  click: ->
    Backbone.history.navigate "/repos/#{@model.id}",
      model: @model

