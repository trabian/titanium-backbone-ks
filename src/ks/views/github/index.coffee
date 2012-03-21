styles = require('styles').ui

sync = require 'lib/sync'

User = require 'models/github/user'

View = require 'views/base'

IssuesView = require './issues'
LoginView = require './login'

{ Button, Window } = require 'views/ui'

module.exports = class GitHubView extends Window

  events:
    open: 'showLoginView'

  initialize: ->

    @user = new User

    @user.sync = (method, model, options) =>
      sync method, model, _.extend {}, options,
        auth:
          login: @user.get 'username'
          password: @user.get 'password'

    @bindTo @user, 'change:id', @render

  render: =>

    @layout (view) =>

      if @user.id

        view.add @make 'Label', styles.labels.h2,
          text: 'Issues'

        issuesView = new IssuesView
          collection: @user.issues
          controller: @controller
          fetchOnInit: true

        view.add issuesView.render().view

      else

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
