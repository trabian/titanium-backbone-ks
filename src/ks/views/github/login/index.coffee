Form = require 'presenters/form'

FormWindow = require 'views/ui/form/window'

module.exports = class GitHubLogin extends FormWindow

  attributes: ->
    super
      modal: true
      title: 'GitHub Login'

  initialize: ->

    @presenter = new Form
      model: @model
      fields: @buildFields()

    @bindTo @model, 'sync', =>
      @close()

    @options.saveButton = 'Login'

    super

  buildFields: =>

    username =
      key: 'username'
      label: 'Username'
      hint: 'me@example.com'
      as: 'email'
      required: true

    password =
      key: 'password'
      label: 'Password'
      as: 'password'
      required: true

    body =
      key: 'body'
      label: 'Body'
      hint: 'Comment'
      as: 'textarea'
      section: 'none'

    [ username, password, body ]
