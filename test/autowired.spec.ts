import { Test, Expect, TestFixture, Timeout } from "alsatian";
import { Autowired, MODE, Lazy_Container } from "../lib";

class T2 {
    id: number
    constructor() {
        this.id = Date.now();
    }
}

@TestFixture('Autowired Test')
export class AOPTest {
    @Autowired()
    T2: T2

    @Autowired()
    T3: T2

    @Autowired({ mode: MODE.Lazy })
    T4: T2

    @Test(`Singleton injection should work`)
    @Timeout(10000)
    public async Default_injection() {
        Expect(this.T2.id).toBe(this.T3.id);
    }

    @Test(`Lazy injection should work`)
    @Timeout(10000)
    public async Lazy_injection() {
        Expect(Lazy_Container.get(T2)).toBe(undefined);
        this.T4;
        Expect(typeof Lazy_Container.get(T2).id).toEqual("number");
    }
}

