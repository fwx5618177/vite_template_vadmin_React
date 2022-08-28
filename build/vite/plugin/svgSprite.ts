/**
 *  Vite Plugin for fast creating SVG sprites.
 * https://github.com/anncwb/vite-plugin-svg-icons
 */

import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export const configSvgIconPlugin = (_isBuild: boolean) => {
    const svgIconPlugin = createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        svgoOptions: _isBuild,
        symbolId: 'icon-[dir]-[name]',
    })

    return svgIconPlugin
}
