import { getOptions } from '../recastOptions'

describe('recastOptions', () => {
  describe('getOptions', () => {
    it('should return Unix line terminator for code with only LF', () => {
      const code = 'const a = 1\nconst b = 2\n'
      const result = getOptions(code)
      
      expect(result).toEqual({ lineTerminator: '\n' })
    })

    it('should return Windows line terminator for code with only CRLF', () => {
      const code = 'const a = 1\r\nconst b = 2\r\n'
      const result = getOptions(code)
      
      expect(result).toEqual({ lineTerminator: '\r\n' })
    })

    it('should return Unix line terminator for code with mixed line terminators', () => {
      const code = 'const a = 1\r\nconst b = 2\nconst c = 3\r\n'
      const result = getOptions(code)
      
      expect(result).toEqual({ lineTerminator: '\n' })
    })

    it('should return Unix line terminator for code with no line terminators', () => {
      const code = 'const a = 1'
      const result = getOptions(code)
      
      expect(result).toEqual({ lineTerminator: '\n' })
    })

    it('should return Unix line terminator for empty string', () => {
      const code = ''
      const result = getOptions(code)
      
      expect(result).toEqual({ lineTerminator: '\n' })
    })

    it('should handle code with LF at beginning after CR', () => {
      const code = '\r\nconst a = 1\nconst b = 2'
      const result = getOptions(code)
      
      expect(result).toEqual({ lineTerminator: '\n' })
    })

    it('should handle single CRLF without other line breaks', () => {
      const code = 'const a = 1\r\nconst b = 2'
      const result = getOptions(code)
      
      expect(result).toEqual({ lineTerminator: '\r\n' })
    })

    it('should handle multiple CRLF without LF', () => {
      const code = 'line1\r\nline2\r\nline3\r\n'
      const result = getOptions(code)
      
      expect(result).toEqual({ lineTerminator: '\r\n' })
    })

    it('should detect LF even when preceded by CR in different context', () => {
      const code = 'const str = "\\r"\nconst a = 1\r\n'
      const result = getOptions(code)
      
      expect(result).toEqual({ lineTerminator: '\n' })
    })
  })
})
