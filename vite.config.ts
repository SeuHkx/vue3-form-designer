import { defineConfig } from 'vite'
import { resolve }  from 'path'
import vue from "@vitejs/plugin-vue"
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue'],
      dts: true,
      resolvers: [
        VantResolver(),
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon'
        })
      ],
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        ElementPlusResolver(),
        VantResolver()
      ],
    }),
    Icons({
      autoInstall: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: "import { h } from 'vue';",
  },
  build: {
    lib: {
      entry: './lib/test.ts',
      name: 'test',
      fileName: 'test'
    },
    sourcemap: true,
    rollupOptions:{
      external: ['vue','element-plus','@element-plus/icons-vue'],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus':'element-plus'
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
    open: false,
    cors: true,
    proxy: {
      '/api': {
        target: 'https://examples.epicjs.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
      },
    },
  }
})
