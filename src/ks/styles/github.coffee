colors = require('styles/theme').colors

detailsStyles = require('styles/ui/table').details

module.exports =

  issues:

    table:
      view: detailsStyles.view
      row:
        title:
          view:
            left: 11
            right: 11
          label: detailsStyles.row.title.label
