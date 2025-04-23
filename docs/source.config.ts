import { remarkInstall } from "fumadocs-docgen"
import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import remarkCodeImport from "remark-code-import"

export const { docs, meta } = defineDocs({
    dir: "content/docs"
})

export default defineConfig({
    mdxOptions: {
        remarkPlugins: [remarkInstall, remarkCodeImport]
    }
})
