function fromString(str) {
    let number = 0n;

    for (let i = 0; i < str.length; i += 1) {
      const c = str.charAt(i);
      if (i > 0) {
        number += 1n;
      }
      number *= 26n;
      if (c >= "A" && c <= "Z") {
        number += BigInt(c.charCodeAt(0) - "A".charCodeAt(0));
      } else {
        throw new Error(`Invalid character in rune name: ${c}`);
      }
    }

    return number;
  }

console.log(fromString("ABCDEFGHIJKL"));
