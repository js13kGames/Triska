createNumberGenerator = seed => {
    const ints = new Uint32Array([
        Math.imul(seed, 0x85ebca6b),
        Math.imul(seed, 0xc2b2ae35),
    ]);

    return () => {
        const s0 = ints[0];
        const s1 = ints[1] ^ s0;
        ints[0] = (s0 << 26 | s0 >> 8) ^ s1 ^ s1 << 9;
        ints[1] = s1 << 13 | s1 >> 19;
        return (Math.imul(s0, 0x9e3779bb) >>> 0) / 0xffffffff;
    };
};
