styles = require('styles').ui

TabGroup = require 'views/ui/tabs/group'

module.exports = class MainView extends TabGroup

  initialize: ->

    layout =
      title: 'Layout',
      viewClass: require 'ks/views/layout'
      icon: 'ks/layout.png'

    tables =
      title: 'Tables'
      viewClass: require 'ks/views/tables'
      icon: 'ks/tables.png'

    forms =
      title: 'Forms'
      viewClass: require 'ks/views/forms'
      icon: 'ks/forms.png'

    github =
      title: 'GitHub'
      viewClass: require 'ks/views/github'
      icon: 'ks/github.png'

    @options.items = [ tables, github, layout, forms ]

    super
