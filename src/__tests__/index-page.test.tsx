import { render, screen } from '@testing-library/react'
import DocumentPage, { getStaticProps } from '../pages/[[...name]]'
import { getTestGardenPath } from './test-helpers'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: { name: [] },
      asPath: '/',
    }
  },
}))

jest.mock('../lib/config', () => ({
  getBaseDir: () => getTestGardenPath(),
}))

describe('Index Page', () => {
  describe('with file based garden', () => {
    it('renders README content', async () => {
      const result = await getStaticProps({ params: { name: [] } })
      const { props } = result as {
        props: { content: string | null }
      }

      render(<DocumentPage content={props.content} />)

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByText('Index page for garden1')).toBeInTheDocument()

      expect(screen.getByRole('link', { name: 'bar' })).toHaveAttribute(
        'href',
        '/bar'
      )
    })
  })
})
