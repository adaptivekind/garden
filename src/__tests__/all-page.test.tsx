import { render, screen } from '@testing-library/react'
import AllPages, { getStaticProps } from '../pages/x/all'
import { getTestGardenPath } from './test-helpers'

jest.mock('../lib/config', () => ({
  getBaseDir: () => getTestGardenPath(),
}))

describe('All Pages - End to End', () => {
  describe('Component Rendering', () => {
    it('renders page header correctly', () => {
      const files = [
        { path: 'README.md', name: 'README', title: 'README' },
        { path: 'foo.md', name: 'foo', title: 'Foo' },
      ]

      render(<AllPages files={files} />)

      expect(screen.getByText('All Markdown Files')).toBeInTheDocument()
      expect(
        screen.getByText('This page lists all markdown files in the directory.')
      ).toBeInTheDocument()
    })

    it('renders file list with links and paths', () => {
      const files = [
        { path: 'README.md', name: 'README', title: 'README' },
        { path: 'foo.md', name: 'foo', title: 'Foo Page' },
        { path: 'dir/baz.md', name: 'baz', title: 'Baz' },
      ]

      render(<AllPages files={files} />)

      // Check links are rendered correctly
      expect(screen.getByRole('link', { name: 'README' })).toHaveAttribute(
        'href',
        '/README'
      )
      expect(screen.getByRole('link', { name: 'Foo Page' })).toHaveAttribute(
        'href',
        '/foo'
      )
      expect(screen.getByRole('link', { name: 'Baz' })).toHaveAttribute(
        'href',
        '/baz'
      )

      // Check file paths are shown
      expect(screen.getByText('(README.md)')).toBeInTheDocument()
      expect(screen.getByText('(foo.md)')).toBeInTheDocument()
      expect(screen.getByText('(dir/baz.md)')).toBeInTheDocument()
    })

    it('handles empty file list', () => {
      render(<AllPages files={[]} />)

      expect(screen.getByText('All Markdown Files')).toBeInTheDocument()
      const list = screen.getByRole('list')
      expect(list).toBeEmptyDOMElement()
    })
  })

  describe('getStaticProps - Real Implementation', () => {
    it('loads all files from test garden', async () => {
      const result = await getStaticProps({})

      expect(result).toHaveProperty('props')
      expect(result).toHaveProperty('revalidate', 60)

      const { props } = result as {
        props: { files: Array<{ path: string; name: string; title: string }> }
      }

      const fileNames = props.files.map(f => f.name).sort()
      expect(fileNames).toContain('kitchen-sink')
    })

    it('includes correct file information', async () => {
      const result = await getStaticProps({})
      const { props } = result as {
        props: { files: Array<{ path: string; name: string; title: string }> }
      }

      // Check README file
      const readmeFile = props.files.find(f => f.name === 'readme')
      expect(readmeFile).toBeTruthy()
      expect(readmeFile?.title).toBeTruthy()

      // Check nested file
      const bazFile = props.files.find(f => f.name === 'baz')
      expect(bazFile).toBeTruthy()
      expect(bazFile?.path).toBe('baz')

      // Check all files have required properties
      props.files.forEach(file => {
        expect(file).toHaveProperty('path')
        expect(file).toHaveProperty('name')
        expect(file).toHaveProperty('title')
        expect(typeof file.path).toBe('string')
        expect(typeof file.name).toBe('string')
        expect(typeof file.title).toBe('string')
      })
    })

    it('renders real file data correctly', async () => {
      const result = await getStaticProps({})
      const { props } = result as {
        props: { files: Array<{ path: string; name: string; title: string }> }
      }

      render(<AllPages files={props.files} />)

      // Check that all test garden files are rendered
      expect(screen.getByRole('link', { name: /readme/ })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /bar/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /foo/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /baz/i })).toBeInTheDocument()
      expect(
        screen.getByRole('link', { name: /kitchen-sink/i })
      ).toBeInTheDocument()
    })

    it('returns proper data structure for Next.js', async () => {
      const result = await getStaticProps({})

      expect(result).toEqual({
        props: {
          files: expect.arrayContaining([
            expect.objectContaining({
              path: expect.any(String),
              name: expect.any(String),
              title: expect.any(String),
            }),
          ]),
        },
        revalidate: 60,
      })
    })
  })
})
