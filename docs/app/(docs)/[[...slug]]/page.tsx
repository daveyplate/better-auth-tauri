import { createGenerator } from "fumadocs-typescript"
import { AutoTypeTable } from "fumadocs-typescript/ui"

import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page"
import { notFound } from "next/navigation"

import { source } from "@/lib/source"
const generator = createGenerator()

export default async function Page(props: {
    params: Promise<{ slug?: string[] }>
}) {
    const params = await props.params
    const page = source.getPage(params.slug)

    if (!page) notFound()

    const MDX = page.data.body

    return (
        <DocsPage full={page.data.full} toc={page.data.toc}>
            <DocsTitle>{page.data.title}</DocsTitle>

            <DocsDescription>{page.data.description}</DocsDescription>

            <DocsBody>
                <MDX
                    components={{
                        AutoTypeTable: (props) => (
                            <AutoTypeTable {...props} generator={generator} />
                        ),
                        Tab,
                        Tabs,
                        ...defaultMdxComponents
                    }}
                />
            </DocsBody>
        </DocsPage>
    )
}

export async function generateStaticParams() {
    return source.generateParams()
}

export async function generateMetadata(props: {
    params: Promise<{ slug?: string[] }>
}) {
    const params = await props.params
    const page = source.getPage(params.slug)

    if (!page) notFound()

    return {
        title: page.data.title,
        description: page.data.description
    }
}
