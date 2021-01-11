import "reflect-metadata";

export enum MODE {
	Singleton = 0,
	Ordinary,
	Lazy
}

const containers = new Map();

export const Containers = {
	get(func: any, ...args: any) {
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
		if (mode == MODE.Singleton) {
			if (!containers.has(typeClass)) {
				containers.set(typeClass, new typeClass(...options.arguments));
			}
			descriptor.get = () => {
				return containers.get(typeClass);
			}
		}
		else if (mode == MODE.Lazy) {
			descriptor.get = () => {
				if (!containers.has(typeClass)) {
					containers.set(typeClass, new typeClass(...options.arguments));
				}
				return containers.get(typeClass);
			}
		}
		else {
			descriptor.value = new typeClass(...options.arguments);
		}
		return descriptor;
	};
}
