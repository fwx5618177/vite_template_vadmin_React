import { PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import purgeIcons from 'vite-plugin-purge-icons'
import windiCSS from 'vite-plugin-windicss'
import VitePluginCertificate from 'vite-plugin-mkcert'
import { configHtmlPlugin } from './html'
import { configPwaConfig } from './pwa'
import { configMockPlugin } from './mock'
import { configCompressPlugin } from './compress'
import { configStyleImportPlugin } from './styleImport'
import { configVisualizerConfig } from './visualizer'
import { configThemePlugin } from './theme'
import { configImageminPlugin } from './imagemin'
import { configSvgIconPlugin } from './svgSprite'

export const createVitePlugins = (viteEnv: ViteEnv, isBuild: boolean) => {
    const {
        VITE_USE_IMAGEMIN,
        VITE_USE_MOCK,
        VITE_LEGACY,
        VITE_BUILD_COMPRESS,
        VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    } = viteEnv

    const vitePlugins: (PluginOption | PluginOption[])[] = [
        react(),
        VitePluginCertificate({
            source: 'coding',
        }),
        windiCSS(),
    ]

    VITE_LEGACY && isBuild && vitePlugins.push(legacy())
    vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))
    vitePlugins.push(configSvgIconPlugin(isBuild))
    VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild))
    vitePlugins.push(purgeIcons())
    // vite-plugin-style-import
    vitePlugins.push(configStyleImportPlugin(isBuild))

    // rollup-plugin-visualizer
    vitePlugins.push(configVisualizerConfig())

    // vite-plugin-theme
    vitePlugins.push(configThemePlugin(isBuild))

    if (isBuild) {
        // vite-plugin-imagemin
        VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin())

        // rollup-plugin-gzip
        vitePlugins.push(
            configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
        )

        // vite-plugin-pwa
        vitePlugins.push(configPwaConfig(viteEnv))
    }

    return vitePlugins
}
