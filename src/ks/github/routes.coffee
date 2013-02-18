module.exports = (match) ->

  match '', 'repos'

  match '/repos/:id', 'repos#show'
