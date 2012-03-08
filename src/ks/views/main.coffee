styles = require('styles').ui

{ Window } = require 'views/ui'

module.exports = class MainView extends Window

  render: =>

    @layout (view) =>

      view.add @make 'Label', styles.labels.h1,
        text: 'Kitchen Sink'

    @
