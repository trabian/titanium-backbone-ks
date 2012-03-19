FormWindow = require 'views/ui/form/window'

module.exports = class GitHubLogin extends FormWindow

  initialize: ->
    @view.modal = true
    @view.title = 'GitHub Login'
    super

  render: =>

    @
