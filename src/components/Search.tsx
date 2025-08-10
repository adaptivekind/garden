import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

interface GraphNode {
  label: string
  meta?: Record<string, unknown>
}

interface GraphData {
  nodes: Record<string, GraphNode>
  links: Array<{ source: string; target: string }>
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [filteredNodes, setFilteredNodes] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [nodeNames, setNodeNames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Fetch graph data on component mount
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('/garden.json')
        if (response.ok) {
          const graphData: GraphData = await response.json()
          setNodeNames(Object.keys(graphData.nodes))
        }
      } catch (error) {
        console.error('Failed to fetch graph data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGraphData()
  }, [])

  useEffect(() => {
    if (query.length > 2 && nodeNames.length > 0) {
      const filtered = nodeNames
        .filter(name =>
          name.toLowerCase().includes(query.toLowerCase())
        )
        .map(name => name.split('#')[0]) // Remove fragment identifier and everything after
        .filter((name, index, array) => array.indexOf(name) === index) // Remove duplicates
        .slice(0, 10) // Limit to 10 results
      setFilteredNodes(filtered)
      setIsOpen(filtered.length > 0)
      setSelectedIndex(-1)
    } else {
      setFilteredNodes([])
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }, [query, nodeNames])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredNodes.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredNodes.length) {
          navigateToNode(filteredNodes[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const navigateToNode = (nodeName: string) => {
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
    
    // Navigate to the node - handle root case
    if (nodeName.toLowerCase() === 'readme') {
      router.push('/')
    } else {
      router.push(`/${nodeName}`)
    }
  }

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  // Don't render anything if no graph data is available
  if (nodeNames.length === 0 && !isLoading) {
    return null;
  }

  return (
    <header style={{ 
      padding: '16px', 
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <input
        ref={inputRef}
        type="text"
        placeholder={isLoading ? "Loading..." : "Search pages..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          outline: 'none',
          opacity: isLoading ? 0.6 : 1,
          cursor: isLoading ? 'not-allowed' : 'text'
        }}
        data-testid="search-input"
      />
      
      {isOpen && (
        <div 
          className="search-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'transparent',
            zIndex: 998
          }}
          onClick={handleClickOutside}
        />
      )}
      
      {isOpen && (
        <div 
          className="search-results"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 999,
            maxHeight: '300px',
            overflowY: 'auto'
          }}
          data-testid="search-results"
        >
          {filteredNodes.map((nodeName, index) => (
            <div
              key={nodeName}
              onClick={() => navigateToNode(nodeName)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: index === selectedIndex ? '#f5f5f5' : 'transparent',
                borderBottom: index < filteredNodes.length - 1 ? '1px solid #eee' : 'none'
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              data-testid={`search-result-${index}`}
            >
              {nodeName}
            </div>
          ))}
        </div>
      )}
      </div>
    </header>
  )
}