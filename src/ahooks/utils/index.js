export function depsAreSame(deps1, deps2) {
  if (deps1 === deps2) return true;
  for (let i = 0; i < deps1.length; i++) {
    if (!Object.is(deps1[i], deps2[i])) {
      return false;
    }
  }

  return true;
}
