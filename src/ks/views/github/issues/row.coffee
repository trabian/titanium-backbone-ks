styles = require('ks/styles').github.issues.table.row

Row = require 'views/ui/table/row'

Label = require 'views/ui/label'

DetailView = require './detail'

module.exports = class IssuesRow extends Row

  attributes:
    hasChild: true

  events:
    click: 'showDetail'

  initialize: ->
    @bindTo @model, "change", @render

  render: =>

    @wrap (view) =>
      view.add @renderTitle()

    @

  renderTitle: =>

    label = new Label
      label:
        primary: @model.get 'title'
        meta: "Issue ##{@model.get 'number'}"
      style: styles.title.view
      labelStyle: styles.title.label
      controller: @controller

    label.render().view

  showDetail: =>

    detailView = new DetailView
      model: @model
      controller: @controller

    @controller.show 'issueDetail', detailView
