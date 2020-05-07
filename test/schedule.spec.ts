import { Test, Expect, TestFixture, Timeout } from "alsatian";
import { Schedule, Job } from "../lib";
import { setTimeout } from "timers";

const cache = {};

@Schedule()
class T1 {
    flag = true;

    @Job("*/5 * * * * *")
    test() {
        if (!cache["test"]) {
            cache["test"] = { flag: this.flag };
        }
    }
}

@TestFixture('Schedule Test')
export class ScheduleTest {

    async sleep(num: number) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, num);
        })
    }

    @Test("job should work")
    @Timeout(10000)
    public async test2() {
        new T1();
        await this.sleep(7000);
        Expect(cache["test"]).toBeDefined();
        Expect(cache["test"].flag).toBe(true);
    }
}