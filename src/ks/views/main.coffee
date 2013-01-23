template = require './template'

module.exports = class Window extends Backbone.View

  tagName: 'Window'

  events: ->
    'click Button.clickable': => alert "Told you so, #{@model.get 'name'}!"

  bindings:
    'TextField': 'name'
    '.reversed-name':
      observe: 'name'
      onGet: 'reverse'

  reverse: (val) ->
    if val
      "In reverse: #{val.split('').reverse().join('')}"

  render: ->

    @$el.html template
      title: 'Installation was successful using Jade!'
      subtitle: 'This is a subtitle'

    @stickit()

    @

  open: -> @render().el.open()
