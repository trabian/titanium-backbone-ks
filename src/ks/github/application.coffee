Application = require 'tb/chaplin/application'

routes = require './routes'

module.exports = class GithubApplication extends Application

  initialize: ->
    super

    @initDispatcher
      controllerSuffix: ''
      controllerPath: 'ks/github/controllers/'

    @initLayoutManager
      default: 'main'
      layoutSuffix: ''
      layoutPath: 'ks/github/views/layouts/'

    @initRouter routes


