styles = require('ks/styles').github.issues.table

Table = require 'views/ui/table'

module.exports = class IssuesView extends Table

  attributes: styles.view

  initialize: ->

    @options = _.extend {}, @options,
      rowClass: require './row'
      autoHeight: true

    super
