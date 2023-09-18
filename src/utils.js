export function mergeAndCount(arr) {
  const sumAmount = arr?.reduce((a, c) => {
    const obj = a.find((obj) => obj.address === c.address);
    if (!obj) {
      a.push(c);
    } else {
      obj.amount += c.amount;
    }
    return a;
  }, []);

  return sumAmount;
}
