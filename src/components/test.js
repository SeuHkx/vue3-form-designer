function gcd(a, b) {
    // 确保 a 大于 b
    if (a < b) {
        [a, b] = [b, a]; // 交换 a 和 b
    }

    while (b !== 0) {
        const remainder = a % b; // 计算余数
        a = b; // 用 b 替换 a
        b = remainder; // 用余数替换 b
    }

    return a; // 返回最后一个非零余数
}

// 示例
const num1 = 27;
const num2 = 12;
const result = gcd(num1, num2);
console.log(`最大公约数 (GCD) 是: ${result}`);