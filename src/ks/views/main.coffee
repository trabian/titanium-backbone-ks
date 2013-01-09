module.exports = class Window extends Backbone.View

  viewName: 'Window'

  attributes:
    backgroundColor: '#eee'

  render: ->

    Backbone.$('<Label>')
      .attr('text', 'Installation was successful!')
      .appendTo @$el

    @

  open: -> @render().el.open()
