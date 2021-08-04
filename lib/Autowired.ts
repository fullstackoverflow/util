import "reflect-metadata";
import { RequestContext } from "./context/request";

export enum MODE {
	Singleton = 0,
	Ordinary,
	Lazy,
	Request
}

const containers = new Map();

export const Containers = {
	get<T>(func: { new(...args: any): T }, ...args: any): T {
		let instance = containers.get(func);
		if (!instance) {
			instance = new func(...args);
			containers.set(func, instance);
		}
		return instance;
	}
}

/**
 * Inject a class instance
 * @param params class constructor params
 * @example
 * ```typescript
 *
 * class Service{
 * }
 *
 * class Test{
 *  @Autowired()
 *  Service:Service
 * }
 * ```
 */
export function Autowired(options: { mode: MODE; arguments?: any[] } = { mode: MODE.Singleton, arguments: [] }): PropertyDecorator {
	return (target: any, propertyKey: string) => {
		const { mode } = options;
		const typeClass = Reflect.getMetadata("design:type", target, propertyKey);
		const originDescriptor = Reflect.getOwnPropertyDescriptor((target && target.prototype) || target, propertyKey);
		const descriptor = originDescriptor || { configurable: true };
		switch (mode) {
			case MODE.Singleton:
				if (!containers.has(typeClass)) {
					containers.set(typeClass, new typeClass(...(options.arguments ?? [])));
				}
				descriptor.get = () => {
					return containers.get(typeClass);
				}
				break;
			case MODE.Lazy:
				descriptor.get = () => {
					if (!containers.has(typeClass)) {
						containers.set(typeClass, new typeClass(...(options.arguments ?? [])));
					}
					return containers.get(typeClass);
				}
				break;
			case MODE.Ordinary:
				descriptor.value = new typeClass(...(options.arguments ?? []));
				break;
			case MODE.Request:
				descriptor.get = () => {
					if (!RequestContext.getInstance().context.has(typeClass)) {
						RequestContext.getInstance().context.set(typeClass, new typeClass(...(options.arguments ?? [])));
					}
					return RequestContext.getInstance().context.get(typeClass);
				}
				break;
		}
		return descriptor;
	};
}
