styles = require('styles').ui

View = require 'views/base'

{ Window } = require 'views/ui'

module.exports = class LayoutView extends Window

  render: =>

    @layout (view) =>

      view.add @make 'Label', styles.labels.h1,
        text: 'Layout.'

    @
