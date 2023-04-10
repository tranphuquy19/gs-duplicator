function leftJoin<T, K extends keyof T>(
  left: T[],
  right: T[],
  key: K,
  select: (left: T, right: T | undefined) => T
): T[] {
  const rightLookup = right.reduce((lookup, item) => {
    lookup.set(item[key], item);
    return lookup;
  }, new Map<T[K], T>());

  return left.map((item) => {
    return select(item, rightLookup.get(item[key]));
  });
}

export { leftJoin };
