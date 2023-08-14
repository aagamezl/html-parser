/**
 * Represents a comment with a name and content.
 * @typedef {Object} TextNode
 * @property {string} name - The name of the comment (e.g., 'comment').
 * @property {string} value - The content of the comment.
 */

/**
 * Represents a structured entity with a name, properties, and optional children.
 * @typedef {Object} Node
 * @property {string} name - The name of the structured entity.
 * @property {Object} properties - Properties associated with the structured entity.
 * @property {(Node | TextNode)[]} children - An array of child structured entities.
 */

/**
 * Parses attributes and their values from a tag.
 * @param {string} input - The tag input string.
 * @returns {{name: string, attributes: string[]}} Parsed tag name and attributes.
 */
const parseTag = (input) => {
  const regex = /([\w-]+)\s*([^]+)?/

  const [, name, attributesString = ''] = input.match(regex) ?? ['', '']
  const attributes = attributesString.match(/([\w-]+=(?:"[^"]*"|'[^']*'))/g) ?? []

  return { name: name.toLowerCase(), attributes }
}

/**
 * Unescapes HTML entities in a text.
 * @param {string} text - The text to unescape.
 * @returns {string} The unescaped text.
 */
const unescapeHtml = (text) => {
  /**
   * An object containing HTML entity mappings for specific characters.
   * @type {Object.<string, string>}
   */
  const entities = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&#38;': '&',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': ' ',
    '&iexcl;': '¡',
    '&cent;': '¢',
    '&pound;': '£',
    '&curren;': '¤',
    '&yen;': '¥',
    '&brvbar;': '¦',
    '&sect;': '§',
    '&uml;': '¨',
    '&copy;': '©',
    '&ordf;': 'ª',
    '&laquo;': '«',
    '&not;': '¬',
    '&shy;': '\u00AD',
    '&reg;': '®',
    '&macr;': '¯',
    '&deg;': '°',
    '&plusmn;': '±',
    '&sup2;': '²',
    '&sup3;': '³',
    '&acute;': '´',
    '&micro;': 'µ',
    '&para;': '¶',
    '&middot;': '·',
    '&cedil;': '¸',
    '&sup1;': '¹',
    '&ordm;': 'º',
    '&raquo;': '»',
    '&frac14;': '¼',
    '&frac12;': '½',
    '&frac34;': '¾',
    '&iquest;': '¿',
    '&Agrave;': 'À',
    '&Aacute;': 'Á',
    '&Acirc;': 'Â',
    '&Atilde;': 'Ã',
    '&Auml;': 'Ä',
    '&Aring;': 'Å',
    '&AElig;': 'Æ',
    '&Ccedil;': 'Ç',
    '&Egrave;': 'È',
    '&Eacute;': 'É',
    '&Ecirc;': 'Ê',
    '&Euml;': 'Ë',
    '&Igrave;': 'Ì',
    '&Iacute;': 'Í',
    '&Icirc;': 'Î',
    '&Iuml;': 'Ï',
    '&ETH;': 'Ð',
    '&Ntilde;': 'Ñ',
    '&Ograve;': 'Ò',
    '&Oacute;': 'Ó',
    '&Ocirc;': 'Ô',
    '&Otilde;': 'Õ',
    '&Ouml;': 'Ö',
    '&times;': '×',
    '&Oslash;': 'Ø',
    '&Ugrave;': 'Ù',
    '&Uacute;': 'Ú',
    '&Ucirc;': 'Û',
    '&Uuml;': 'Ü',
    '&Yacute;': 'Ý',
    '&THORN;': 'Þ',
    '&szlig;': 'ß',
    '&agrave;': 'à',
    '&aacute;': 'á',
    '&acirc;': 'â',
    '&atilde;': 'ã',
    '&auml;': 'ä',
    '&aring;': 'å',
    '&aelig;': 'æ',
    '&ccedil;': 'ç',
    '&egrave;': 'è',
    '&eacute;': 'é',
    '&ecirc;': 'ê',
    '&euml;': 'ë',
    '&igrave;': 'ì',
    '&iacute;': 'í',
    '&icirc;': 'î',
    '&iuml;': 'ï',
    '&eth;': 'ð',
    '&ntilde;': 'ñ',
    '&ograve;': 'ò',
    '&oacute;': 'ó',
    '&ocirc;': 'ô',
    '&otilde;': 'õ',
    '&ouml;': 'ö',
    '&divide;': '÷',
    '&oslash;': 'ø',
    '&ugrave;': 'ù',
    '&uacute;': 'ú',
    '&ucirc;': 'û',
    '&uuml;': 'ü',
    '&yacute;': 'ý',
    '&thorn;': 'þ',
    '&yuml;': 'ÿ'
  }

  return entities[text] ?? text
}

/**
 *
 * @param {string} attribute
 * @returns {{name: string, value: string}}
 */
const parseAttribute = (attribute) => {
  const [, name, value] = attribute.split(/([\w-]+)\s*=\s*([^]+)?/g)

  return { name, value }
}

/**
 *
 * @param {string} html
 * @returns {(Node | TextNode)[]}
 */
export const htmlParser = (html) => {
  /** @type {(Node | TextNode)[]} */
  const result = []
  const stack = []

  let index = 0
  while (index < html.length) {
    const tagStart = html.indexOf('<', index)

    if (tagStart === -1) {
      // break
      const value = unescapeHtml(html.substring(index))/* .trim() */

      if (value) {
        result.push({ name: 'text', value })
      }

      break
    }

    if (tagStart > index) {
      const textContent = unescapeHtml(html.substring(index, tagStart))

      if (textContent) {
        const lastNode = stack[stack.length - 1]

        if (lastNode) {
          lastNode.children.push({ name: 'text', value: textContent })
        } else {
          result.push({ name: 'text', value: textContent })
        }
      }
    }

    let tagEndLength = 1 // The end of normal tag has 1 character
    // Adjust tag end search to account for special characters
    let tagEnd = html.indexOf('>', tagStart)
    let attributeContext = false

    if (tagStart !== -1) {
      for (let i = tagStart; i < html.length; i++) {
        if (html[i] === '"') {
          attributeContext = !attributeContext
        } else if (html[i] === '>' && !attributeContext) {
          tagEnd = i

          break
        }
      }
    }

    if (tagEnd === -1) {
      break
    }

    const tag = html.substring(tagStart + 1, tagEnd).trim()
    if (tag.startsWith('/')) {
      // Closing tag, pop from stack
      stack.pop()
    } else if (tag.startsWith('!--')) {
      // Comment node
      tagEnd = html.indexOf('-->', tagStart)
      tagEndLength = 3 // The end of the comment tag has 3 characters

      if (tagEnd !== -1) {
        const commentContent = html.substring(tagStart + 4, tagEnd)/* .trim() */
        const commentNode = { name: 'comment', value: commentContent }
        const lastNode = stack[stack.length - 1]

        if (lastNode) {
          lastNode.children.push(commentNode)
        } else {
          result.push(commentNode)
        }
      }
    } else {
      // Opening tag
      const { name, attributes } = parseTag(tag)

      const properties = attributes.map(attr => {
        const { name, value } = parseAttribute(attr)

        if (value.startsWith('"{') && value.endsWith('}"')) {
          // Handle dynamic event attributes
          return { name, value: JSON.parse(value.slice(1, -1)) }
        }
        return { name, value }
      })

      /** @type {Node} */
      const node = { name, properties, children: [] }
      const lastNode = stack[stack.length - 1]

      if (lastNode) {
        lastNode.children.push(node)
      } else {
        result.push(node)
      }

      if (!tag.endsWith('/') && name.toLowerCase() !== 'br') {
        stack.push(node)
      }
    }

    index = tagEnd + tagEndLength
    // index = commentEnd !== -1 ? commentEnd + 3 : tagEnd + 1 // Update index correctly
    // index = index < tagEnd ? tagEnd + 1 : index + 3
  }

  return result
}
