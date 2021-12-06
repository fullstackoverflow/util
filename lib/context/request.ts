import asyncHooks from "async_hooks";
export class RequestContext<T extends Object = Object> {
    ContextManager: Map<number, T>;

    ContextCache: WeakMap<T, Map<any, any>>;

    private static instance: RequestContext

    private constructor() {
        this.ContextManager = new Map();
        this.ContextCache = new WeakMap();
        this.createHooks(this);
    }

    static getInstance() {
        if (!RequestContext.instance) {
            RequestContext.instance = new RequestContext();
        }
        return RequestContext.instance;
    }

    init(ctx: T) {
        const eid = asyncHooks.executionAsyncId();
        this.ContextManager.set(eid, ctx);
        if (!this.ContextCache.has(ctx)) {
            this.ContextCache.set(ctx, new Map());
        }
    }

    get context() {
        const eid = asyncHooks.executionAsyncId();
        const ctx = this.ContextManager.get(eid);
        return ctx;
    }

    private createHooks(context: RequestContext) {
        function init(asyncId: number, type: string, triggerId: number, resource: Object) {
            if (context.ContextManager.has(triggerId)) {
                context.ContextManager.set(asyncId, context.ContextManager.get(triggerId));
            }
        }

        function destroy(asyncId: number) {
            context.ContextManager.delete(asyncId);
        }

        const asyncHook = asyncHooks.createHook({ init, destroy });

        asyncHook.enable();
    }
}
