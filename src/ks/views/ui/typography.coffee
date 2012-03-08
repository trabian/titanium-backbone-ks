styles = require('ks/styles').ui

Window = require 'views/ui/window'

module.exports = class IntroView extends Window

  buildHeading: (view, size) =>

    view.add @make 'Label', styles.labels["h#{size}"],
      text: "Heading #{size}"
      bottom: 10

  render: =>

    @layout (view) =>

      @buildHeading(view, size) for size in [1..6]

    @
