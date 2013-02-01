View = require 'tb/views/base'

module.exports = class RepoView extends View

  tagName: 'TableViewRow'

  template: require './template'
