
import Koa from 'koa';
import Busboy from 'async-busboy'

export function FileStream({consume:(fieldname:string, file, filename, encoding, mimetype)=>void}) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originFunction: Function = descriptor.value;
        descriptor.value = async function (ctx: Koa.Context, next: Function) {
            var busboy = new Busboy({ headers: ctx.req.headers });
            const stream = await new Promise(resolve => {
                busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                    resolve({
                        [fieldname]: {
                            name: filename,
                            stream: file
                        }
                    });
                });
                ctx.req.pipe(busboy);
            })
            await originFunction.apply(this, arguments);
        }
    }
}