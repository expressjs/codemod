/**
 * By default, jscodeshift(recast) uses the line terminator of the OS the code runs on.
 * This is often not desired, so we instead try to detect it from the input.
 * If there is at least one Windows-style linebreak (CRLF) in the input and 
 * no Unix-style linebreak (LF), use that. In all other cases, use Unix-style (LF).
 * @return '\n' or '\r\n'
 */
export function getOptions(code: string) {
  return { lineTerminator: detectLineTerminator(code) };
}

function detectLineTerminator(code: string) {
  const hasCRLF = /\r\n/.test(code);
  const hasLF = /[^\r]\n/.test(code);

  return (hasCRLF && !hasLF) ? '\r\n' : '\n';
}