import { defineUserConfig } from "vuepress"
import { DefaultThemeOptions, ViteBundlerOptions } from "vuepress";
import { codeBlockPlugin } from "vuepress-plugin-code-block"
export default defineUserConfig<DefaultThemeOptions,ViteBundlerOptions>({
    title:"文档中心",
    bundlerConfig:{
        viteOptions:{
            server:{
                fs:{
                    strict:false
                }
            }
        }
    },
    plugins:[
        [
            codeBlockPlugin,
            {}
        ]
    ]
})
