CollectionView = require 'tb/views/collection'

module.exports = class ReposView extends CollectionView

  tagName: 'Window'

  className: 'github-repos'

  listSelector: 'TableView'

  template: require './template'

  itemView: require './row'
