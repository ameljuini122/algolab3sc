import test from 'node:test';
import assert from 'node:assert/strict';
import { runEducationalPythonSandbox } from './pythonFallback';

test('sandbox executes loops, functions, ord/chr, and slicing accurately', () => {
  const code = `
def double_plus_un(x):
    return x * 2 + 1

mot = "ALGO"
s = 0
for i in range(1, 5):
    s += i
print(double_plus_un(s))
print(mot[1:3])
print(chr(ord("A") + 2))
`;
  const res = runEducationalPythonSandbox(code);
  assert.equal(res.stderr, '');
  assert.equal(res.stdout, '21\nLG\nC');
});

test('sandbox handles input() consumption and match/case', () => {
  const code = `
j = int(input("Jour: "))
match j:
    case 1:
        print("Lundi")
    case 6 | 7:
        print("Weekend")
    case _:
        print("Semaine")
`;
  const res = runEducationalPythonSandbox(code, ['7']);
  assert.equal(res.stderr, '');
  assert.equal(res.stdout, 'Weekend');
});

test('sandbox protects against infinite while loops and reports ZeroDivisionError', () => {
  const infCode = `
i = 1
while i > 0:
    i += 1
`;
  const infRes = runEducationalPythonSandbox(infCode);
  assert.match(infRes.stderr, /Temps d’exécution dépassé|boucle infinie/i);

  const divCode = `print(10 // 0)`;
  const divRes = runEducationalPythonSandbox(divCode);
  assert.match(divRes.stderr, /ZeroDivisionError/i);
});
