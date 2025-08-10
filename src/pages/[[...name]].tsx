import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { processWikiLinks } from '../lib/markdown'
import { createSiteGarden } from '../lib/garden'

interface DocumentPageProps {
  content: string | null
}

export default function DocumentPage({ content }: DocumentPageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!content) {
    return (
      <article>
        <h1>Not Found</h1>
        <p>The requested markdown file could not be found.</p>
      </article>
    )
  }

  return (
    <article>
      <ReactMarkdown>{processWikiLinks(content)}</ReactMarkdown>
    </article>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const garden = await createSiteGarden()
  const paths = Object.keys(garden.graph.nodes).map((id: string) => {
    return {
      params: {
        name: [id],
      },
    }
  })

  paths.push({
    params: {
      name: [],
    },
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const nameArray = params?.name as string[] | undefined
  const garden = await createSiteGarden()

  const isRootPath = !nameArray || nameArray.length === 0
  const targetName = isRootPath ? 'readme' : nameArray[0]
  const document = await garden.repository.find(targetName)

  if (!document && isRootPath) {
    return {
      props: {
        content: null,
      },
      revalidate: 60,
    }
  }

  // For other paths, return 404 if not found
  if (!document) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      content: document.content,
    },
    revalidate: 60,
  }
}
