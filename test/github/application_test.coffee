helpers = require '../helpers'

{ assert } = helpers.chai

_ = require 'underscore'

Backbone = helpers.require 'backbone'
Chaplin = helpers.require 'chaplin'

Application = helpers.require 'ks/github/application'

describe 'Application', ->

  beforeEach ->
    @app = new Application()

  it 'should initialize without an error', ->

    assert.doesNotThrow =>
      @app.initialize()

  it 'should show load a layout manager', ->

    @app.initialize()

    assert.ok @app.layoutManager

  it 'should show load a layout', ->

    @app.initialize()

    assert.ok @app.layoutManager.layout
