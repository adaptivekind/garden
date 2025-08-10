export interface GraphNode {
  label: string
  meta?: Record<string, unknown>
}

export interface GraphData {
  nodes: Record<string, GraphNode>
  links: Array<{ source: string; target: string }>
}

// Server-side functions (only work on server)
export function getGraphFilePath(): string {
  if (typeof window !== 'undefined') {
    throw new Error('getGraphFilePath can only be called on the server')
  }
  
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require('path')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getBaseDir } = require('./config')
  return path.join(getBaseDir(), '.garden-graph.json')
}

export function hasGraphFile(): boolean {
  if (typeof window !== 'undefined') {
    return false // Client-side always returns false, will be handled by getStaticProps
  }
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs')
    return fs.existsSync(getGraphFilePath())
  } catch {
    return false
  }
}

export function loadGraphData(): GraphData | null {
  if (typeof window !== 'undefined') {
    throw new Error('loadGraphData can only be called on the server')
  }
  
  if (!hasGraphFile()) {
    return null
  }
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs')
    const content = fs.readFileSync(getGraphFilePath(), 'utf8')
    return JSON.parse(content) as GraphData
  } catch (error) {
    console.error('Failed to load graph data:', error)
    return null
  }
}

export function getNodeNames(): string[] {
  if (typeof window !== 'undefined') {
    throw new Error('getNodeNames can only be called on the server')
  }
  
  const graphData = loadGraphData()
  if (!graphData) {
    return []
  }
  
  return Object.keys(graphData.nodes)
}