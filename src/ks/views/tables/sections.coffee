styles = require('styles/ui')

ViewPresenter = require 'presenters/view'

View = require 'views/base'

Table = require 'views/ui/table'
DetailsTable = require 'views/ui/table/details'

{ Window } = require 'views/ui'

module.exports = class SectionsTableView extends Window

  attributes:
    title: 'Details Table'

  render: =>

    layoutOptions =
      style: styles.window.layouts.noPadding

    @layout layoutOptions, (view) =>

      sectionsTable = new Table
        controller: @controller
        items: @buildItems()
        rowClass: require 'views/ui/table/details/row'
        autoHeight: true

      view.add sectionsTable.render().view

    @

  buildItems: =>

    items =

      simple:
        title: 'title'

    (value for key, value of items)
