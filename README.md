[![codecov](https://codecov.io/gh/fullstackoverflow/config/branch/master/graph/badge.svg)](https://codecov.io/gh/fullstackoverflow/config)
[![NPM version](https://img.shields.io/npm/v/@tosee/config.svg)](https://www.npmjs.com/@tosee/config)
![CI](https://github.com/fullstackoverflow/config/workflows/CI/badge.svg)

# 介绍

配置文件加载

# 快速开始

```
export CONFIG=./src/config
export NODE_ENV=test
```

src/default.ts
```
export default {
    test1: false,
    test3: 1 + 2
};
```

src/test.ts
```
export default {
	test1: true,
	test2: 1 + 2
};
```

```
@TestFixture('Config')
export class TestSuit {
    @Test("value should equal")
    public async equal() {
        Expect(Config.instance.test1).toEqual(true);
    }

    @Test("value should support expression")
    public async Expression() {
        Expect(Config.instance.test2).toEqual(3);
    }

    @Test("if default.ts exist,value should merge default")
    public async MergeDefault() {
        Expect(Config.instance.test3).toEqual(3);
    }

    @Value("test1")
    test1: Boolean;

    @Test("value should support inject with @Value")
    public async decorator1() {
        Expect(this.test1).toEqual(true);
    }
}
```