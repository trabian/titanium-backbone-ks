module.exports =

  run: (options) ->

    if options
      require('tb').load options

    model = new Backbone.Model
      name: 'John Doe'

    MainView = require 'ks/views/main'
    (new MainView { model }).open()
