styles = require('styles').ui

{ Button, ContentBlock, Window } = require 'views/ui'

module.exports = class IntroView extends Window

  render: =>

    @layout (view) =>

      view.add @make 'Label', styles.labels.h1,
        text: 'Welcome to your mobile app'

      contentBlock = new ContentBlock
        text: '''
          The Kitchen Sink project was included in this bootstrapped app as an example
          of user interface elements and coding style for titanium-backbone. To remove
          the kitchen sink, simply remove the titanium-backbone-ks module from package.json
          and remove the reference to 'KitchenSinkIntroView' from src/index.coffee
        '''

      view.add contentBlock.render().view

      button = new Button
        text: 'Launch Kitchen Sink'
        click: @openKitchenSink

      view.add button.render().view

    @

  openKitchenSink: ->

    console.log 'Open the kitchen sink.'

    KitchenSink = require './main'

    kitchenSink = new KitchenSink

    kitchenSink.render().open()
