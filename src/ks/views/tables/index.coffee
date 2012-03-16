ViewPresenter = require 'presenters/view'

View = require 'views/base'

NavigationTable = require 'views/ui/table/navigation'

DetailsTableView = require './details'
SectionsTableView = require './sections'

{ Window } = require 'views/ui'

module.exports = class TablesView extends Window

  render: =>

    @layout (view) =>

      navigationTable = new NavigationTable
        items: @buildItems()
        controller: @controller

      view.add navigationTable.render().view

    @

  buildItems: =>

    details =

      title: 'Details Table'
      click: =>

        detailsTableView = new DetailsTableView
          controller: @controller

        @controller.show 'detailsTable', detailsTableView

    sections =

      title: 'Sections'
      click: =>

        sectionsTableView = new SectionsTableView
          controller: @controller

        @controller.show 'sectionsTable', sectionsTableView

    infinity = 

      title: 'Inifinity'
      click: =>

        tablesView = new TablesView
          controller: @controller
          style:
            title: 'Tables'

        @controller.show 'tablesView', tablesView

    [ details, sections, infinity ]
