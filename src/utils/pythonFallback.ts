export interface PythonRunResult {
  stdout: string;
  stderr: string;
  runtime: 'pyodide' | 'sandbox';
  durationMs: number;
}

type PyVal = unknown;

class ExecutionLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExecutionLimitError';
  }
}

function splitTopLevelArgs(expr: string): string[] {
  const args: string[] = [];
  let current = '';
  let depth = 0;
  let quote: string | null = null;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (quote) {
      current += ch;
      if (ch === quote && expr[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      current += ch;
    } else if (ch === '(' || ch === '[' || ch === '{') {
      depth++;
      current += ch;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      depth--;
      current += ch;
    } else if (ch === ',' && depth === 0) {
      args.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0) args.push(current.trim());
  return args;
}

function stripInlineComment(line: string): string {
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote && line[i - 1] !== '\\') quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '#') {
      return line.slice(0, i);
    }
  }
  return line;
}

function formatPyValue(v: PyVal): string {
  if (v === true) return 'True';
  if (v === false) return 'False';
  if (v === null || v === undefined) return 'None';
  if (Array.isArray(v)) {
    return `[${v.map((item) => (typeof item === 'string' ? `'${item}'` : formatPyValue(item))).join(', ')}]`;
  }
  return String(v);
}

/**
 * Pure TypeScript safe educational Python 3SC sandbox interpreter.
 * Used as an isolated instant runner when Pyodide WASM is unavailable (e.g. offline/hermetic environments).
 */
export function runEducationalPythonSandbox(code: string, inputs: string[] = []): PythonRunResult {
  const start = Date.now();
  const outputs: string[] = [];
  let inputIdx = 0;
  let steps = 0;
  const MAX_STEPS = 12000;

  const tick = (lineNum: number) => {
    steps++;
    if (steps > MAX_STEPS) {
      throw new ExecutionLimitError(
        `Temps d’exécution dépassé à la ligne ${lineNum} : vérifie qu’il n’y a pas une boucle infinie (condition while toujours vraie).`
      );
    }
  };

  interface BlockNode {
    lineNum: number;
    indent: number;
    raw: string;
    body: BlockNode[];
  }

  const rawLines = code.split('\n');
  const flat: { lineNum: number; indent: number; raw: string }[] = [];
  for (let i = 0; i < rawLines.length; i++) {
    const noComment = stripInlineComment(rawLines[i]);
    if (!noComment.trim()) continue;
    const indent = noComment.match(/^(\s*)/)?.[1].length ?? 0;
    flat.push({ lineNum: i + 1, indent, raw: noComment.trim() });
  }

  function buildTree(startIdx: number, parentIndent: number): { nodes: BlockNode[]; nextIdx: number } {
    const nodes: BlockNode[] = [];
    let idx = startIdx;
    let expectedIndent: number | null = null;
    while (idx < flat.length) {
      const item = flat[idx];
      if (item.indent <= parentIndent) break;
      if (expectedIndent === null) expectedIndent = item.indent;
      if (item.indent !== expectedIndent) {
        throw new Error(`IndentationError: unexpected indent (line ${item.lineNum})`);
      }
      const node: BlockNode = { ...item, body: [] };
      idx++;
      if (item.raw.endsWith(':') && idx < flat.length && flat[idx].indent > item.indent) {
        const sub = buildTree(idx, item.indent);
        node.body = sub.nodes;
        idx = sub.nextIdx;
      }
      nodes.push(node);
    }
    return { nodes, nextIdx: idx };
  }

  interface FuncDef {
    params: string[];
    body: BlockNode[];
  }

  const globals: Record<string, PyVal> = {};
  const functions: Record<string, FuncDef> = {};

  class ReturnSignal {
    value: PyVal;
    constructor(value: PyVal) {
      this.value = value;
    }
  }

  const builtins: Record<string, (...args: PyVal[]) => PyVal> = {
    int: (x = 0) => {
      if (typeof x === 'boolean') return x ? 1 : 0;
      const n = parseInt(String(x), 10);
      if (Number.isNaN(n)) throw new Error(`ValueError: invalid literal for int()`);
      return n;
    },
    float: (x = 0) => {
      const n = parseFloat(String(x));
      if (Number.isNaN(n)) throw new Error(`ValueError: could not convert string to float`);
      return n;
    },
    str: (x = '') => formatPyValue(x),
    bool: (x) => Boolean(x),
    len: (x) => {
      if (typeof x === 'string' || Array.isArray(x)) return x.length;
      throw new Error(`TypeError: object has no len()`);
    },
    abs: (x) => Math.abs(Number(x)),
    round: (x, ndigits) => {
      const num = Number(x);
      if (ndigits !== undefined) {
        const factor = Math.pow(10, Number(ndigits));
        return Math.round(num * factor) / factor;
      }
      // Python round-half-to-even
      const floor = Math.floor(num);
      const frac = num - floor;
      if (Math.abs(frac - 0.5) < 1e-9) {
        return floor % 2 === 0 ? floor : floor + 1;
      }
      return Math.round(num);
    },
    sqrt: (x) => {
      const n = Number(x);
      if (n < 0) throw new Error(`ValueError: math domain error`);
      return Math.sqrt(n);
    },
    ord: (c) => {
      const s = String(c);
      if (s.length !== 1) throw new Error(`TypeError: ord() expected a character`);
      return s.charCodeAt(0);
    },
    chr: (n) => String.fromCharCode(Number(n)),
    randint: (a, b) => {
      const min = Math.ceil(Number(a));
      const max = Math.floor(Number(b));
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    array: (arr) => (Array.isArray(arr) ? [...arr] : []),
    range: (...args) => {
      let startR = 0;
      let stopR = 0;
      let stepR = 1;
      if (args.length === 1) stopR = Number(args[0]);
      else if (args.length === 2) {
        startR = Number(args[0]);
        stopR = Number(args[1]);
      } else if (args.length >= 3) {
        startR = Number(args[0]);
        stopR = Number(args[1]);
        stepR = Number(args[2]);
      }
      if (stepR === 0) throw new Error(`ValueError: range() arg 3 must not be zero`);
      const res: number[] = [];
      if (stepR > 0) {
        for (let k = startR; k < stopR; k += stepR) res.push(k);
      } else {
        for (let k = startR; k > stopR; k += stepR) res.push(k);
      }
      return res;
    },
    input: () => {
      if (inputIdx < inputs.length) return String(inputs[inputIdx++]);
      return '';
    },
    print: (...args) => {
      outputs.push(args.map((a) => formatPyValue(a)).join(' '));
      return null;
    },
    sum: (arr) => (Array.isArray(arr) ? arr.reduce((a, b) => Number(a) + Number(b), 0) : 0),
    min: (...args) => {
      const flatArr = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.min(...flatArr.map(Number));
    },
    max: (...args) => {
      const flatArr = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.max(...flatArr.map(Number));
    },
  };

  function evalExpr(expr: string, env: Record<string, PyVal>, lineNum: number): PyVal {
    const trimmed = expr.trim();
    if (!trimmed) return null;

    // Handle inline list comprehension [expr for var in iterable]
    const compMatch = trimmed.match(/^\[(.+?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+(.+?)(?:\s+if\s+(.+))?\]$/);
    if (compMatch) {
      const [, itemExpr, iterVar, iterExpr, condExpr] = compMatch;
      const iterable = evalExpr(iterExpr, env, lineNum);
      if (!Array.isArray(iterable)) throw new Error(`TypeError: object is not iterable (line ${lineNum})`);
      const res: PyVal[] = [];
      for (const el of iterable) {
        const subEnv = { ...env, [iterVar]: el };
        if (!condExpr || Boolean(evalExpr(condExpr, subEnv, lineNum))) {
          res.push(evalExpr(itemExpr, subEnv, lineNum));
        }
      }
      return res;
    }

    const jsHelpers = {
      __call: (name: string, ...args: PyVal[]): PyVal => {
        if (name in builtins) return builtins[name](...args);
        if (name in functions) {
          const fn = functions[name];
          const localEnv: Record<string, PyVal> = {};
          fn.params.forEach((p, idx) => {
            localEnv[p] = args[idx];
          });
          try {
            execBlock(fn.body, localEnv);
          } catch (sig) {
            if (sig instanceof ReturnSignal) return sig.value;
            throw sig;
          }
          return null;
        }
        throw new Error(`NameError: name '${name}' is not defined (line ${lineNum})`);
      },
      __method: (obj: PyVal, method: string, ...args: PyVal[]): PyVal => {
        if (typeof obj === 'string') {
          if (method === 'find') return obj.indexOf(String(args[0] ?? ''));
          if (method === 'upper') return obj.toUpperCase();
          if (method === 'lower') return obj.toLowerCase();
          if (method === 'isdigit') return /^\d+$/.test(obj);
          if (method === 'isalpha') return /^[a-zA-Z]+$/.test(obj);
          if (method === 'strip') return obj.trim();
          if (method === 'join') {
            const arr = Array.isArray(args[0]) ? args[0] : [];
            return arr.map((x) => formatPyValue(x)).join(obj);
          }
          if (method === 'split') return obj.trim().split(/\s+/);
        }
        if (Array.isArray(obj)) {
          if (method === 'append') {
            obj.push(args[0]);
            return null;
          }
        }
        throw new Error(`AttributeError: object has no attribute '${method}' (line ${lineNum})`);
      },
      __slice: (obj: PyVal, startS: PyVal, stopS: PyVal, stepS: PyVal): PyVal => {
        const isStr = typeof obj === 'string';
        const seq = isStr ? obj : Array.isArray(obj) ? obj : [];
        const len = seq.length;
        const step = stepS === undefined || stepS === null ? 1 : Number(stepS);
        if (step === 0) throw new Error(`ValueError: slice step cannot be zero`);
        let s = startS === undefined || startS === null ? (step > 0 ? 0 : len - 1) : Number(startS);
        let e = stopS === undefined || stopS === null ? (step > 0 ? len : -len - 1) : Number(stopS);
        if (s < 0) s = Math.max(len + s, step > 0 ? 0 : -1);
        if (e < 0 && stopS !== undefined && stopS !== null) e = Math.max(len + e, -1);
        const out: unknown[] = [];
        if (step > 0) {
          for (let k = Math.max(0, s); k < Math.min(len, e); k += step) out.push(seq[k]);
        } else {
          for (let k = Math.min(len - 1, s); k > Math.max(-1, e); k += step) out.push(seq[k]);
        }
        return isStr ? out.join('') : out;
      },
      __index: (obj: PyVal, idx: PyVal): PyVal => {
        const n = Number(idx);
        if (typeof obj === 'string' || Array.isArray(obj)) {
          const actual = n < 0 ? obj.length + n : n;
          if (actual < 0 || actual >= obj.length) {
            throw new Error(`IndexError: index out of range (line ${lineNum})`);
          }
          return obj[actual];
        }
        throw new Error(`TypeError: object is not subscriptable (line ${lineNum})`);
      },
      __mul: (a: PyVal, b: PyVal): PyVal => {
        if (typeof a === 'string' && typeof b === 'number') return a.repeat(b);
        if (typeof a === 'number' && typeof b === 'string') return b.repeat(a);
        if (Array.isArray(a) && typeof b === 'number') {
          const out: PyVal[] = [];
          for (let i = 0; i < b; i++) out.push(...a);
          return out;
        }
        return Number(a) * Number(b);
      },
      __in: (a: PyVal, b: PyVal): boolean => {
        if (typeof b === 'string') return b.includes(String(a));
        if (Array.isArray(b)) return b.includes(a);
        return false;
      },
      __divInt: (a: PyVal, b: PyVal): number => {
        if (Number(b) === 0) throw new Error(`ZeroDivisionError: integer division by zero (line ${lineNum})`);
        return Math.floor(Number(a) / Number(b));
      },
      __div: (a: PyVal, b: PyVal): number => {
        if (Number(b) === 0) throw new Error(`ZeroDivisionError: division by zero (line ${lineNum})`);
        return Number(a) / Number(b);
      },
      __mod: (a: PyVal, b: PyVal): number => {
        if (Number(b) === 0) throw new Error(`ZeroDivisionError: modulo by zero (line ${lineNum})`);
        return ((Number(a) % Number(b)) + Number(b)) % Number(b);
      },
      __str: (v: PyVal): string => formatPyValue(v),
    };

    const transformed = compilePythonExpr(trimmed, env, globals, functions, builtins, lineNum);
    const allVars: Record<string, PyVal> = { ...globals, ...env };
    const varNames = Object.keys(allVars);
    const varValues = varNames.map((k) => allVars[k]);

    try {
      const fn = new Function(
        '__h',
        ...varNames,
        `return (${transformed});`
      );
      return fn(jsHelpers, ...varValues);
    } catch (err) {
      if (err instanceof Error && /(Error:)/.test(err.message)) throw err;
      throw new Error(`SyntaxError: invalid syntax (line ${lineNum})`);
    }
  }

  function execBlock(nodes: BlockNode[], env: Record<string, PyVal>) {
    let i = 0;
    while (i < nodes.length) {
      const node = nodes[i];
      tick(node.lineNum);
      const raw = node.raw;

      // Skip imports supported natively
      if (/^(from\s+\w+\s+import\s+.+|import\s+.+)$/.test(raw)) {
        i++;
        continue;
      }
      if (raw === 'pass') {
        i++;
        continue;
      }

      // Function definition
      const defMatch = raw.match(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:$/);
      if (defMatch) {
        const [, fnName, paramStr] = defMatch;
        const params = paramStr
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);
        functions[fnName] = { params, body: node.body };
        i++;
        continue;
      }
      if (raw.startsWith('def ')) {
        throw new Error(`SyntaxError: invalid def syntax (line ${node.lineNum})`);
      }

      // Return
      if (raw.startsWith('return')) {
        const expr = raw.slice(6).trim();
        const val = expr ? evalExpr(expr, env, node.lineNum) : null;
        throw new ReturnSignal(val);
      }

      // If / Elif / Else
      if (raw.startsWith('if ') && raw.endsWith(':')) {
        const condExpr = raw.slice(3, -1).trim();
        let executed = false;
        if (Boolean(evalExpr(condExpr, env, node.lineNum))) {
          execBlock(node.body, env);
          executed = true;
        }
        i++;
        while (i < nodes.length && (nodes[i].raw.startsWith('elif ') || nodes[i].raw === 'else:')) {
          const branch = nodes[i];
          if (!executed) {
            if (branch.raw === 'else:') {
              execBlock(branch.body, env);
              executed = true;
            } else if (branch.raw.startsWith('elif ') && branch.raw.endsWith(':')) {
              const bCond = branch.raw.slice(5, -1).trim();
              if (Boolean(evalExpr(bCond, env, branch.lineNum))) {
                execBlock(branch.body, env);
                executed = true;
              }
            }
          }
          i++;
        }
        continue;
      }
      if (raw.startsWith('if ') && !raw.endsWith(':')) {
        throw new Error(`SyntaxError: expected ':' (line ${node.lineNum})`);
      }

      // Match / Case
      if (raw.startsWith('match ') && raw.endsWith(':')) {
        const subjectExpr = raw.slice(6, -1).trim();
        const subjectVal = evalExpr(subjectExpr, env, node.lineNum);
        for (const cNode of node.body) {
          if (!cNode.raw.startsWith('case ') || !cNode.raw.endsWith(':')) continue;
          const pattern = cNode.raw.slice(5, -1).trim();
          if (pattern === '_') {
            execBlock(cNode.body, env);
            break;
          }
          const parts = pattern.split('|').map((p) => p.trim());
          const hit = parts.some((p) => evalExpr(p, env, cNode.lineNum) === subjectVal);
          if (hit) {
            execBlock(cNode.body, env);
            break;
          }
        }
        i++;
        continue;
      }

      // For loop
      const forMatch = raw.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):$/);
      if (forMatch) {
        const [, varName, iterExpr] = forMatch;
        const iterVal = evalExpr(iterExpr, env, node.lineNum);
        const items: PyVal[] =
          typeof iterVal === 'string'
            ? iterVal.split('')
            : Array.isArray(iterVal)
            ? iterVal
            : [];
        for (const item of items) {
          tick(node.lineNum);
          env[varName] = item;
          execBlock(node.body, env);
        }
        i++;
        continue;
      }

      // While loop
      if (raw.startsWith('while ') && raw.endsWith(':')) {
        const condExpr = raw.slice(6, -1).trim();
        while (Boolean(evalExpr(condExpr, env, node.lineNum))) {
          tick(node.lineNum);
          execBlock(node.body, env);
        }
        i++;
        continue;
      }

      // Multiple statements separated by ;
      const subStmts = raw.split(';').map((s) => s.trim()).filter(Boolean);
      for (const stmt of subStmts) {
        execSingleStatement(stmt, env, node.lineNum);
      }
      i++;
    }
  }

  function execSingleStatement(stmt: string, env: Record<string, PyVal>, lineNum: number) {
    // Augmented assignment +=, -=, *=, //=
    const augMatch = stmt.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/\/=)\s*(.+)$/);
    if (augMatch) {
      const [, name, op, rhs] = augMatch;
      const cur = env[name] ?? globals[name];
      if (cur === undefined) throw new Error(`NameError: name '${name}' is not defined (line ${lineNum})`);
      const rhsVal = evalExpr(rhs, env, lineNum);
      if (op === '+=') env[name] = typeof cur === 'string' ? cur + String(rhsVal) : Number(cur) + Number(rhsVal);
      if (op === '-=') env[name] = Number(cur) - Number(rhsVal);
      if (op === '*=') env[name] = Number(cur) * Number(rhsVal);
      if (op === '//=') env[name] = Math.floor(Number(cur) / Number(rhsVal));
      return;
    }

    // Indexed assignment arr[idx] = val
    const idxAssign = stmt.match(/^([a-zA-Z_]\w*)\[(.+?)\]\s*=\s*(.+)$/);
    if (idxAssign) {
      const [, arrName, idxExpr, valExpr] = idxAssign;
      const arr = env[arrName] ?? globals[arrName];
      const idxVal = Number(evalExpr(idxExpr, env, lineNum));
      const newVal = evalExpr(valExpr, env, lineNum);
      if (!Array.isArray(arr)) throw new Error(`TypeError: object does not support item assignment (line ${lineNum})`);
      arr[idxVal] = newVal;
      return;
    }

    // Simple assignment var = expr (not ==)
    const assignMatch = stmt.match(/^([a-zA-Z_]\w*)\s*=(?!=)\s*(.+)$/);
    if (assignMatch) {
      const [, name, rhs] = assignMatch;
      env[name] = evalExpr(rhs, env, lineNum);
      return;
    }

    // Expression statement (e.g. print(...), list.append(...))
    evalExpr(stmt, env, lineNum);
  }

  try {
    const { nodes } = buildTree(0, -1);
    execBlock(nodes, globals);
    return {
      stdout: outputs.join('\n'),
      stderr: '',
      runtime: 'sandbox',
      durationMs: Date.now() - start,
    };
  } catch (err) {
    return {
      stdout: outputs.join('\n'),
      stderr: err instanceof Error ? err.message : String(err),
      runtime: 'sandbox',
      durationMs: Date.now() - start,
    };
  }
}

function findMatchingDelim(str: string, openIdx: number, openChar: string, closeChar: string): number {
  let depth = 0;
  let quote: string | null = null;
  for (let i = openIdx; i < str.length; i++) {
    const ch = str[i];
    if (quote) {
      if (ch === quote && str[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === openChar) {
      depth++;
    } else if (ch === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function splitTopLevelBy(expr: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (quote) {
      if (ch === quote && expr[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(' || ch === '[' || ch === '{') {
      depth++;
    } else if (ch === ')' || ch === ']' || ch === '}') {
      depth--;
    } else if (depth === 0 && expr.slice(i, i + sep.length) === sep) {
      parts.push(expr.slice(start, i));
      start = i + sep.length;
      i += sep.length - 1;
    }
  }
  parts.push(expr.slice(start));
  return parts;
}

function compilePythonExpr(
  expr: string,
  env: Record<string, PyVal>,
  globals: Record<string, PyVal>,
  functions: Record<string, unknown>,
  builtins: Record<string, unknown>,
  lineNum: number
): string {
  const strings: string[] = [];
  const tokenized = expr.replace(/([fF]?)(["'])(?:\\.|(?!\2).)*\2/g, (m, prefix) => {
    const idx = strings.length;
    if (prefix === 'f' || prefix === 'F') {
      const inner = m.slice(2, -1);
      const compiledParts: string[] = [];
      let cursor = 0;
      while (cursor < inner.length) {
        const openBrace = inner.indexOf('{', cursor);
        if (openBrace === -1) {
          compiledParts.push(JSON.stringify(inner.slice(cursor)));
          break;
        }
        if (openBrace > cursor) {
          compiledParts.push(JSON.stringify(inner.slice(cursor, openBrace)));
        }
        const closeBrace = inner.indexOf('}', openBrace + 1);
        if (closeBrace === -1) {
          compiledParts.push(JSON.stringify(inner.slice(openBrace)));
          break;
        }
        const innerExpr = inner.slice(openBrace + 1, closeBrace);
        compiledParts.push(
          `__h.__str(${compilePythonExpr(innerExpr, env, globals, functions, builtins, lineNum)})`
        );
        cursor = closeBrace + 1;
      }
      strings.push(`(${compiledParts.length ? compiledParts.join(' + ') : '""'})`);
    } else {
      strings.push(m);
    }
    return `__STR_${idx}__`;
  });

  const compiled = compilePythonInner(tokenized, env, globals, functions, builtins, lineNum);
  return compiled.replace(/__STR_(\d+)__/g, (_, idxStr) => strings[Number(idxStr)] ?? '""');
}

function compilePythonInner(
  expr: string,
  env: Record<string, PyVal>,
  globals: Record<string, PyVal>,
  functions: Record<string, unknown>,
  builtins: Record<string, unknown>,
  lineNum: number
): string {
  let s = expr
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null')
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '||')
    .replace(/\bnot\s+in\b/g, '__NOT_IN__')
    .replace(/\bnot\s+/g, '!');

  // Transform method calls obj.method(args), function calls fn(args), and indexing obj[i]
  let out = '';
  let i = 0;
  while (i < s.length) {
    // Method call: <ident|__STR_n__>.<ident>(...)
    const methHead = s.slice(i).match(/^([a-zA-Z_]\w*|__STR_\d+__)\.([a-zA-Z_]\w*)\s*\(/);
    if (methHead && !methHead[1].startsWith('__h')) {
      const [fullHead, objName, methName] = methHead;
      const openParenIdx = i + fullHead.length - 1;
      const closeParenIdx = findMatchingDelim(s, openParenIdx, '(', ')');
      if (closeParenIdx !== -1) {
        const rawArgs = s.slice(openParenIdx + 1, closeParenIdx);
        const compiledArgs = rawArgs.trim()
          ? splitTopLevelArgs(rawArgs)
              .map((a) => compilePythonInner(a, env, globals, functions, builtins, lineNum))
              .join(', ')
          : '';
        out += `__h.__method(${objName}, "${methName}"${compiledArgs ? ', ' + compiledArgs : ''})`;
        i = closeParenIdx + 1;
        continue;
      }
    }

    // Function call: <ident>(...)
    const fnHead = s.slice(i).match(/^([a-zA-Z_]\w*)\s*\(/);
    const prevChar = i > 0 ? s[i - 1] : '';
    if (fnHead && !/[a-zA-Z0-9_.]/.test(prevChar)) {
      const [fullHead, fnName] = fnHead;
      if (!fnName.startsWith('__')) {
        const openParenIdx = i + fullHead.length - 1;
        const closeParenIdx = findMatchingDelim(s, openParenIdx, '(', ')');
        if (closeParenIdx !== -1) {
          if (!(fnName in builtins) && !(fnName in functions)) {
            throw new Error(`NameError: name '${fnName}' is not defined (line ${lineNum})`);
          }
          const rawArgs = s.slice(openParenIdx + 1, closeParenIdx);
          const filteredArgs = rawArgs.trim()
            ? splitTopLevelArgs(rawArgs)
                .filter((a) => !/^(end|sep)\s*=/.test(a.trim()))
                .map((a) => compilePythonInner(a, env, globals, functions, builtins, lineNum))
                .join(', ')
            : '';
          out += `__h.__call("${fnName}"${filteredArgs ? ', ' + filteredArgs : ''})`;
          i = closeParenIdx + 1;
          continue;
        }
      }
    }

    // Subscript / Slice: <ident|__STR_n__>[...]
    const subHead = s.slice(i).match(/^([a-zA-Z_]\w*|__STR_\d+__)\[/);
    if (subHead && !/[a-zA-Z0-9_.]/.test(prevChar) && !subHead[1].startsWith('__h')) {
      const [fullHead, targetName] = subHead;
      const openBrIdx = i + fullHead.length - 1;
      const closeBrIdx = findMatchingDelim(s, openBrIdx, '[', ']');
      if (closeBrIdx !== -1) {
        const inside = s.slice(openBrIdx + 1, closeBrIdx);
        const colonParts = splitTopLevelBy(inside, ':');
        if (colonParts.length >= 2) {
          const argA = colonParts[0].trim()
            ? compilePythonInner(colonParts[0], env, globals, functions, builtins, lineNum)
            : 'null';
          const argB = colonParts[1].trim()
            ? compilePythonInner(colonParts[1], env, globals, functions, builtins, lineNum)
            : 'null';
          const argC =
            colonParts[2] && colonParts[2].trim()
              ? compilePythonInner(colonParts[2], env, globals, functions, builtins, lineNum)
              : 'null';
          out += `__h.__slice(${targetName}, ${argA}, ${argB}, ${argC})`;
        } else {
          const idxExpr = compilePythonInner(inside, env, globals, functions, builtins, lineNum);
          out += `__h.__index(${targetName}, ${idxExpr})`;
        }
        i = closeBrIdx + 1;
        continue;
      }
    }

    out += s[i];
    i++;
  }

  s = out;

  // Replace chained comparisons like 0 <= x <= 20
  s = s.replace(
    /([a-zA-Z0-9_.\[\]()]+)\s*(<=|<|>=|>)\s*([a-zA-Z0-9_.\[\]()]+)\s*(<=|<|>=|>)\s*([a-zA-Z0-9_.\[\]()]+)/g,
    '($1 $2 $3 && $3 $4 $5)'
  );

  // Replace `a not in b` and `a in b`
  s = s.replace(/([a-zA-Z0-9_.\[\]()]+|__STR_\d+__)\s*__NOT_IN__\s*([a-zA-Z0-9_.\[\]()]+|__STR_\d+__)/g, '!__h.__in($1, $2)');
  s = s.replace(/([a-zA-Z0-9_.\[\]()]+|__STR_\d+__)\s+in\s+([a-zA-Z0-9_.\[\]()]+|__STR_\d+__)/g, '__h.__in($1, $2)');

  // Replace integer division // and modulo % safely on operands
  const atom = String.raw`(?:__h\.[a-zA-Z0-9_]+\([^()]*\)|__STR_\d+__|[a-zA-Z_]\w*|\d+(?:\.\d+)?|\([^()]+\))`;
  s = s.replace(new RegExp(`(${atom})\\s*\\/\\/\\s*(${atom})`, 'g'), '__h.__divInt($1, $2)');
  s = s.replace(new RegExp(`(${atom})\\s*%\\s*(${atom})`, 'g'), '__h.__mod($1, $2)');

  // Replace multiplication in case of string/list repetition when * is present
  s = s.replace(/(__STR_\d+__|\[[^\]]+\])\s*\*\s*([a-zA-Z0-9_()+.-]+)/g, '__h.__mul($1, $2)');

  return s;
}
