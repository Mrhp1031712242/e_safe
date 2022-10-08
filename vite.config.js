import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'


export default defineConfig(({ mode })=>{
  const env = loadEnv(mode, __dirname)
  return {
    plugins: [
      vue(),
    ],
    https: false,
    ssr: false,
    base: env.VITE_APP_BASEURL,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
      extensions: [".js", ".vue", ".json"],
    },
    build:{
      outDir: 'esafe_dist_3.0',
    },
    server: {
      port: 7111,
      host: '0.0.0.0',
      // 反向代理
      proxy: {
        '/esafe': {
          target: 'http://192.168.210.186/esafe/',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/esafe/, '')
        }
      }
    }
  }
})
