import { defineUserConfig } from "vuepress"
import { DefaultThemeOptions, ViteBundlerOptions } from "vuepress";

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
    plugins:[]
})
