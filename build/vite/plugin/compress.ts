/**
 * Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 * https://github.com/anncwb/vite-plugin-compression
 */
import type { PluginOption } from 'vite'
import compressPluin from 'vite-plugin-compression'

export const configCompressPlugin = (
    compress: 'gzip' | 'brotli' | 'none',
    deleteOriginFile = false,
): PluginOption | PluginOption[] => {
    const compressList = compress.split(',')
    const plugins: PluginOption[] = []

    if (compressList.includes('gzip')) {
        plugins.push(
            compressPluin({
                ext: '.gz',
                deleteOriginFile,
            }),
        )
    }

    if (compressList.includes('brotli')) {
        plugins.push(
            compressPluin({
                ext: '.br',
                deleteOriginFile,
                algorithm: 'brotliCompress',
            }),
        )
    }

    return plugins
}
