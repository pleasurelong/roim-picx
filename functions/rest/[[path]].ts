import { error } from 'itty-router-extras';

export interface Env {
  BASE_URL: string;
  XK: KVNamespace;
  PICX: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context: EventContext) => {
  const { router } = await import('./router').then(
    async (module) => (await import('./routes'), module)
  );

  // 添加跨域响应头的函数
  const addCorsHeaders = (response: Response): Response => {
    response.headers.set('Access-Control-Allow-Origin', '*'); // 允许所有域
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE'); // 允许的 HTTP 方法
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允许的请求头
    response.headers.set('Access-Control-Allow-Credentials', 'true'); // 如果需要允许凭据
    return response;
  };

  // 检测 OPTIONS 请求并直接返回 CORS 头
  if (context.request.method === 'OPTIONS') {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    });
    return new Response(null, { headers });
  }

  try {
    const response: Response | undefined = await router.handle(context.request, context.env);

    // 如果路由返回响应，则添加 CORS 头
    if (response) {
      return addCorsHeaders(response);
    }

    // 如果路由没有匹配，则返回 404 并添加 CORS 头
    return addCorsHeaders(error(404, 'not found'));
  } catch (err) {
    // 在捕获错误时添加 CORS 头
    return addCorsHeaders(error(500, (err as Error).message));
  }
};

