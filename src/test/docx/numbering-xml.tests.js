import duck from 'duck'

import { Element as XmlElement } from '../../lib/xml'
import { readNumberingXml } from '../../lib/docx/numbering-xml'

const test = require('../test')(module)

test('w:num element inherits levels from w:abstractNum', function () {
  const numbering = readNumberingXml(
    new XmlElement('w:numbering', {}, [
      new XmlElement('w:abstractNum', {'w:abstractNumId': '42'}, [
        new XmlElement('w:lvl', {'w:ilvl': '0'}, [
          new XmlElement('w:numFmt', {'w:val': 'bullet'})
        ]),
        new XmlElement('w:lvl', {'w:ilvl': '1'}, [
          new XmlElement('w:numFmt', {'w:val': 'decimal'})
        ])
      ]),
      new XmlElement('w:num', {'w:numId': '47'}, [
        new XmlElement('w:abstractNumId', {'w:val': '42'})
      ])
    ])
  )
  duck.assertThat(numbering.findLevel('47', '0'), duck.hasProperties({
    isOrdered: false
  }))
  duck.assertThat(numbering.findLevel('47', '1'), duck.hasProperties({
    isOrdered: true
  }))
})
