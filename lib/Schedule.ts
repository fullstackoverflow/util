import { RecurrenceRule, RecurrenceSpecDateRange, RecurrenceSpecObjLit, scheduleJob } from "node-schedule";

const RULE = Symbol("rule");

/**
 *
 * @param rule
 * @example
 * ```
 *
 * 	@Schedule('* * * * *') //Execute task every minute
 * 	async test(){
 * 		console.log('trigger');
 * 	}
 *
 * ```
 */

export const Schedule = () => {
	return function classDecorator<T extends { new(...args: any[]): {} }>(constr: T) {
		return class extends constr {
			constructor(...args: any[]) {
				super(...args);
				Object.entries(constr.prototype).filter(([k, v]) => typeof v == "function").forEach(([k, v]: [string, Function]) => {
					const fn = v;
					const key = k;
					const rule = Reflect.getMetadata(RULE, constr.prototype, key);
					scheduleJob(rule, fn.bind(this));
				})
			}
		}
	}
}

/**
 *
 * @param rule
 * @example
 * ```
 *
 * 	@Schedule('* * * * *') //Execute task every minute
 * 	async test(){
 * 		console.log('trigger');
 * 	}
 *
 * ```
 */

export const Job = (rule: RecurrenceRule | RecurrenceSpecDateRange | RecurrenceSpecObjLit | Date | string): MethodDecorator => {
    return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
		descriptor.enumerable = true;
        Reflect.defineMetadata(RULE, rule, target, propertyKey);
        return descriptor;
    }
};
