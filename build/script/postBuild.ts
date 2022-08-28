/**
 * vite build后的处理
 */
import { runBuildConfig } from './buildConf'
import colors from 'picocolors'
import pkg from '../../package.json'

export const runBuild = async () => {
    try {
        const argvLists = process.argv.splice(2)

        // Generate configuration file
        if (!argvLists.includes('disabled-config')) {
            runBuildConfig()
        }

        console.log(`✨ ${colors.cyan(`[${pkg.name}]`)}` + ' - build successfully!')
    } catch (error) {
        console.log(colors.red('vite build error:\n' + error))
        process.exit(1)
    }
}

runBuild()
