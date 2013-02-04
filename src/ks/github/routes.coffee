module.exports = (match) ->

  match '', 'issues'

  match '/issues/:id', 'issues#show'
