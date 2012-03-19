styles = require('styles').ui

User = require 'models/github/user'

View = require 'views/base'

LoginView = require './login'

{ Button, Window } = require 'views/ui'

module.exports = class GitHubView extends Window

  events:
    open: 'showLoginView'

  initialize: ->

    @user = new User

    @bindTo @user, 'needs-auth', @showLoginView

  render: =>

    @layout (view) =>

      button = new Button
        text: 'Login to GitHub'
        click: @showLoginView

      view.add button.render().view

    @

  showLoginView: =>

    loginView = new LoginView
      controller: @controller
      model: @user

    @controller.show 'login', loginView
