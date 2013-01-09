require('tb/lib/backbone-extensions').load()

module.exports =

  run: ->
    MainView = require 'ks/views/main'
    (new MainView).open()
