ViewPresenter = require 'presenters/view'

View = require 'views/base'

DetailsTable = require 'views/ui/table/details'

{ Window } = require 'views/ui'

module.exports = class DetailsTableView extends Window

  attributes:
    title: 'Details Table'

  render: =>

    @layout (view) =>

      navigationTable = new DetailsTable
        controller: @controller
        items: @buildItems()

      view.add navigationTable.render().view

      setTimeout (=>
        navigationTable.collection.add @buildChangingRow()
      ), 1000

    @

  buildItems: =>

    items =

      simple:
        title: 'title'

      withMeta:
        title:
          primary: 'title.primary'
          meta: 'title.meta'

      withSubtitle:
        title: 'title'
        subtitle: 'subtitle'

      allTogether:
        title:
          primary: 'title.primary'
          meta: 'title.meta'
        subtitle:
          primary: 'subtitle.primary'
          meta: 'subtitle.meta'

      allTogetherWithClick:
        title:
          primary: 'title.primary'
          meta: 'title.meta'
        subtitle:
          primary: 'subtitle.primary'
          meta: 'subtitle.meta'
        click: =>
          alert 'BOOM, son.'

    (value for key, value of items)

  buildChangingRow: ->

    row = new ViewPresenter
      title: 'Added later'

    setTimeout (->
      row.set
        title: 'And then changed'
    ), 500

    setTimeout (->
      row.set
        subtitle: 'With a subtitle'
    ), 1000

    setTimeout (->
      row.set
        subtitle:
          primary: 'With a subtitle'
          meta: 'And subtitle meta'
    ), 1500

    setTimeout (->
      row.set
        title:
          primary: 'And then changed'
          meta: 'Pretty cool, huh?'
    ), 2000

    row
