styles = require('styles').ui

Form = require 'presenters/form'

{ ContentBlock } = require 'views/ui'

FormWindow = require 'views/ui/form/window'

module.exports = class IssueView extends FormWindow

  initialize: ->

    @view.title = "Issue ##{@model.get 'number'}"

    @presenter = new Form
      model: @model.buildComment()
      fields: @buildFields()

    super

  prepend: (view) =>

    view.add @make 'Label', styles.labels.h3,
      text: @model.get 'title'

    if body = @model.get 'body'

      contentBlock = new ContentBlock
        text: body

      view.add contentBlock.render().view


    @

  buildFields: =>

    body =
      key: 'body'
      label: 'Body'
      hint: 'Comment'
      as: 'textarea'
      section: 'none'

    [ body ]
