import asyncHooks from "async_hooks";
import { Context } from "koa";

export class RequestContext {
    ContextManager: Map<number, WeakMap<Context, Map<Function, any>>>;

    private static instance: RequestContext

    private constructor() {
        this.ContextManager = new Map();
        this.createHooks(this);
    }

    static getInstance() {
        if (!RequestContext.instance) {
            RequestContext.instance = new RequestContext();
        }
        return RequestContext.instance;
    }

    init(ctx: Context) {
        const eid = asyncHooks.executionAsyncId();
        const weakmap = new WeakMap();
        weakmap.set(ctx, new Map());
        this.ContextManager.set(eid, weakmap);
    }

    get context() {
        const eid = asyncHooks.executionAsyncId();
        return this.ContextManager.get(eid);
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
