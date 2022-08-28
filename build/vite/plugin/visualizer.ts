/**
 * Package file volume analysis
 */

import visualizer from 'rollup-plugin-visualizer'
import { isReportMode } from '../../utils'

export const configVisualizerConfig = (): Plugin | any[] => {
    if (isReportMode()) {
        return visualizer({
            filename: './node_modules/.cache/visualizer/stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
        }) as Plugin
    }

    return []
}
