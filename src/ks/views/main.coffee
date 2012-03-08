View = require 'views/base'

module.exports = class MainView extends View

  viewName: 'Window'

  attributes:
    backgroundColor: '#fff'

  render: =>

    @view.add @make 'Label',
      text: 'Kitchen Sink'
      height: 'auto'
      top: 20
      textAlign: 'center'
      color: '#000'
      font:
        fontSize: 20
        fontWeight: 'bold'

    @
