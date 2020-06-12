import "reflect-metadata";

export enum MODE {
	Singleton = 0,
	Ordinary,
	Lazy
}

export const Singleton_Container = new Map();
export const Lazy_Container = new Map();

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
			if (!Singleton_Container.has(typeClass)) {
				Singleton_Container.set(typeClass, new typeClass(...options.arguments));
			}
			descriptor.get = () => {
				return Singleton_Container.get(typeClass);
			}
		}
		else if (mode == MODE.Lazy) {
			descriptor.get = () => {
				if (!Lazy_Container.has(typeClass)) {
					Lazy_Container.set(typeClass, new typeClass(...options.arguments));
				}
				return Lazy_Container.get(typeClass);
			}
		}
		else {
			descriptor.value = new typeClass(...options.arguments);
		}
		return descriptor;
	};
}
