export default {
  async fetch(request: Request): Promise<Response> {
    const origin = request.headers.get("Origin");
    
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // 主业务逻辑
    const response = new Response("Hello, World!", {
      headers: { "Content-Type": "text/plain" },
    });

    // 添加 CORS 头
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  },
};

import { createApp } from 'vue'
import App from './App.vue'
import './permission'
import router from './plugins/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './app.css'
import 'element-plus/dist/index.css'

createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
