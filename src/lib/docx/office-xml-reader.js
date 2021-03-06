import * as xml from '../xml/index'
import { flatten } from '../utils'

const xmlNamespaceMap = {
  'http://schemas.openxmlformats.org/wordprocessingml/2006/main': 'w',
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships': 'r',
  'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing': 'wp',
  'http://schemas.openxmlformats.org/drawingml/2006/main': 'a',
  'http://schemas.openxmlformats.org/drawingml/2006/picture': 'pic',
  'http://schemas.openxmlformats.org/package/2006/content-types': 'content-types',
  'urn:schemas-microsoft-com:vml': 'v',
  'http://schemas.openxmlformats.org/markup-compatibility/2006': 'mc',
  'urn:schemas-microsoft-com:office:word': 'office-word'
}

export const read = xmlString => xml.readString(xmlString, xmlNamespaceMap)
  .then(document => collapseAlternateContent(document)[0])

export const readXmlFromZipFile = (docxFile, path) => {
  if (docxFile.exists(path)) {
    return docxFile.read(path, 'utf-8')
      .then(stripUtf8Bom)
      .then(read)
  } else return Promise.resolve(null)
}

const stripUtf8Bom = xmlString => xmlString.replace(/^\uFEFF/g, '')

const collapseAlternateContent = node => {
  if (node.type === 'element') {
    if (node.name === 'mc:AlternateContent') return node.first('mc:Fallback').children
    else {
      node.children = flatten(node.children.map(collapseAlternateContent, true))
      return [node]
    }
  } else return [node]
}
