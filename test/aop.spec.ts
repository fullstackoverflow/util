import "reflect-metadata";
import { Test, Expect, TestFixture, Timeout, SetupFixture } from "alsatian";
import { Before, After, Around, Catch } from "../lib";

const cache = {};

enum TestType {
    SYNC_BEFORE = "sync_before",
    SYNC_After = "sync_after",
    SYNC_AROUND = "sync_around",
    SYNC_CATCH = "sync_catch",
    ASYNC_BEFORE = "async_before",
    ASYNC_After = "async_after",
    ASYNC_AROUND = "async_around",
    ASYNC_CATCH = "async_catch",
}

class T1 {
    @Before(() => {
        cache[TestType.SYNC_BEFORE] = true;
    })
    [TestType.SYNC_BEFORE]() {
        return cache[TestType.SYNC_BEFORE];
    }

    @Before(() => {
        cache[TestType.ASYNC_BEFORE] = true;
    })
    async [TestType.ASYNC_BEFORE]() {
        return cache[TestType.ASYNC_BEFORE];
    }

    @After(() => {
        cache[TestType.SYNC_After] = true;
    })
    [TestType.SYNC_After]() {
        return cache[TestType.SYNC_After];
    }

    @After(() => {
        cache[TestType.ASYNC_After] = true;
    })
    async [TestType.ASYNC_After]() {
        return cache[TestType.ASYNC_After];
    }

    @Around(() => {
        cache[TestType.SYNC_AROUND] = true;
    })
    [TestType.SYNC_AROUND]() {
        return cache[TestType.SYNC_AROUND];
    }

    @Around(() => {
        cache[TestType.ASYNC_AROUND] = true;
    })
    async [TestType.ASYNC_AROUND]() {
        return cache[TestType.ASYNC_AROUND];
    }

    @Catch(() => {
        throw TestType.SYNC_CATCH;
    })
    [TestType.SYNC_CATCH]() {
        throw true;
    }

    @Catch(() => {
        throw TestType.ASYNC_CATCH;
    })
    async [TestType.ASYNC_CATCH]() {
        throw true;
    }
}

@TestFixture('AOP Test')
export class AOPTest {
    instance: T1;

    @SetupFixture
    init() {
        this.instance = new T1();
    }

    @Test(`${TestType.SYNC_BEFORE} should work`)
    @Timeout(10000)
    public async [TestType.SYNC_BEFORE]() {
        const result = this.instance[TestType.SYNC_BEFORE]();
        Expect(result).toBe(true);
        Expect(cache[TestType.SYNC_BEFORE]).toBe(true);
    }

    @Test(`${TestType.ASYNC_BEFORE} should work`)
    @Timeout(10000)
    public async [TestType.ASYNC_BEFORE]() {
        const result = await this.instance[TestType.ASYNC_BEFORE]();
        Expect(result).toBe(true);
        Expect(cache[TestType.ASYNC_BEFORE]).toBe(true);
    }

    @Test(`${TestType.SYNC_After} should work`)
    @Timeout(10000)
    public async [TestType.SYNC_After]() {
        const result = this.instance[TestType.SYNC_After]();
        Expect(result).toBe(undefined);
        Expect(cache[TestType.SYNC_After]).toBe(true);
    }

    @Test(`${TestType.ASYNC_After} should work`)
    @Timeout(10000)
    public async [TestType.ASYNC_After]() {
        const result = await this.instance[TestType.ASYNC_After]();
        Expect(result).toBe(undefined);
        Expect(cache[TestType.ASYNC_After]).toBe(true);
    }

    @Test(`${TestType.SYNC_AROUND} should work`)
    @Timeout(10000)
    public async [TestType.SYNC_AROUND]() {
        const result = this.instance[TestType.SYNC_AROUND]();
        Expect(result).toBe(true);
        Expect(cache[TestType.SYNC_AROUND]).toBe(true);
    }

    @Test(`${TestType.ASYNC_AROUND} should work`)
    @Timeout(10000)
    public async [TestType.ASYNC_AROUND]() {
        const result = await this.instance[TestType.ASYNC_AROUND]();
        Expect(result).toBe(true);
        Expect(cache[TestType.ASYNC_AROUND]).toBe(true);
    }

    @Test(`${TestType.SYNC_CATCH} should work`)
    @Timeout(10000)
    public async [TestType.SYNC_CATCH]() {
        try {
            this.instance[TestType.SYNC_CATCH]();
        } catch (e) {
            Expect(e).toBe(TestType.SYNC_CATCH);
        }
    }

    @Test(`${TestType.ASYNC_CATCH} should work`)
    @Timeout(10000)
    public async [TestType.ASYNC_CATCH]() {
        try {
            await this.instance[TestType.ASYNC_CATCH]();
        } catch (e) {
            Expect(e).toBe(TestType.ASYNC_CATCH);
        }
    }
}

