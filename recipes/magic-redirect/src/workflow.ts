import type { SgRoot } from "@codemod.com/jssg-types/src/main";
import type Js from '@codemod.com/jssg-types/src/langs/javascript';

async function transform(root: SgRoot<Js>): Promise<string> {
  const rootNode = root.root();
  
  // Helper function to find the request parameter name
  function findRequestParamName(node: any): string {
    // Start from the call expression and traverse up to find function parameters
    let current = node;
    while (current) {
      const parent = current.parent();
      if (!parent) break;
      // Check if we're in a function declaration or arrow function
      if (parent.kind() === 'function_declaration' || parent.kind() === 'arrow_function') {
        const params = parent.field('parameters');

        if (params && params.children().length > 0) {
          const firstParam = params.children()[1];
          if (firstParam.kind() === 'required_parameter') {
            const pattern = firstParam.field('pattern');
            if (pattern && pattern.kind() === 'identifier') {
              return pattern.text();
            }
          }
        }
      }

      current = parent;
    }
    return 'req'; // default fallback
  }

  // Find all redirect and location
  const nodes = rootNode.findAll({
    rule: {
      any: [
        {
          pattern: "$OBJ.redirect($ARG)",
        },
        {
          pattern: "$OBJ.location($ARG)",
        }]
      }
  });

  const edits = nodes.reduce((acc: any[], node: any) => {
    const requestParamName = findRequestParamName(node);
    const obj = node.getMatch("OBJ");
    const arg = node.getMatch("ARG");

    // Only transform when the argument is the literal 'back' (single or double quotes)
    const argText = arg && typeof arg.text === 'function' ? arg.text() : null;
    if (argText !== "'back'" && argText !== '"back"' && argText !== "‘back’" && argText !== "“back”") {
      return acc; // skip this node, no edit
    }

    // Case: obj.redirect('back') or obj.location('back')
    const objText = obj?.text();
    const methodName = node.text().includes('.redirect(') ? 'redirect' : 'location';
    acc.push(node.replace(`${objText}.${methodName}(${requestParamName}.get("Referrer") || "/")`));
    return acc;
  }, [] as any[]);

  const newSource = rootNode.commitEdits(edits);
  return newSource;
}

export default transform;