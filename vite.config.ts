import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import dayjs from 'dayjs'
import { resolve } from 'path'
import pkg from './package.json'
import { generateModifyVars } from './build/generate/generateModifyVars'
import { createProxy } from './build/vite/proxy'
import { wrapperEnv } from './build/utils'
import { createVitePlugins } from './build/vite/plugin'
import { OUTPUT_DIR } from './build/constant'

const pathResolve = (dir: string) => {
    return resolve(process.cwd(), '.', dir)
}

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO = {
    pkg: {
        dependencies,
        devDependencies,
        name,
        version,
    },
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
    const root = process.cwd()
    const env = loadEnv(mode, root)
    // The boolean type read by loadEnv is a string. This function can be converted to boolean type
    const viteEnv = wrapperEnv(env)

    const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv

    const isBuild = command === 'build'

    return {
        base: VITE_PUBLIC_PATH,
        root,
        resolve: {
            alias: [
                {
                    find: 'i18n',
                    replacement: 'i18n/i18n.js',
                },
                // /@/xxxx => src/xxxx
                {
                    find: /\/@\//,
                    replacement: pathResolve('src') + '/',
                },
                // /#/xxxx => types/xxxx
                {
                    find: /\/#\//,
                    replacement: pathResolve('types') + '/',
                },
            ],
        },
        server: {
            https: true,
            host: true,
            port: VITE_PORT,
            proxy: createProxy(VITE_PROXY),
        },
        esbuild: {
            pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
        },
        build: {
            target: 'es2015',
            cssTarget: 'chrome80',
            outDir: OUTPUT_DIR,
            minify: 'terser',
            /**
             * 当 minify=“minify:'terser'” 解开注释
             * Uncomment when minify="minify:'terser'"
             */
            terserOptions: {
                compress: {
                    keep_infinity: true,
                    drop_console: VITE_DROP_CONSOLE,
                },
            },
            // Turning off brotliSize display can slightly reduce packaging time
            // brotliSize: false,
            chunkSizeWarningLimit: 2000,
        },
        define: {
            __INTLIFY_PROD_DEVTOOLS__: false,
            __APP_INFO__: JSON.stringify(__APP_INFO),
        },

        css: {
            preprocessorOptions: {
                less: {
                    modifyVars: generateModifyVars(),
                    javascriptEnabled: true,
                },
            },
        },

        // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
        plugins: createVitePlugins(viteEnv, isBuild),

        optimizeDeps: {
            // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
            include: [
                '@iconify/iconify',
                'ant-design-vue/es/locale/zh_CN',
                'ant-design-vue/es/locale/en_US',
            ],
        },

        // experimental: {
        //     renderBuiltUrl(
        //         filename: string,
        //         {
        //             hostId,
        //             hostType,
        //             type,
        //         }: { hostId: string; hostType: 'js' | 'css' | 'html'; type: 'public' | 'asset' },
        //     ) {
        //         if (type === 'public') {
        //             return 'https://www.domain.com/' + filename
        //         } else if (path.extname(hostId) === '.js') {
        //             return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
        //         } else {
        //             return 'https://cdn.domain.com/assets/' + filename
        //         }
        //     },
        // },
    }
}
