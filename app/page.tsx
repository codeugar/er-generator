'use client';
import { useState } from 'react'
import { Parser, AST } from 'node-sql-parser'
import mermaid from 'mermaid'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import DownloadButton from './components/DownloadButton'
import dynamic from 'next/dynamic'

// 在文件顶部或函数外部添加以下接口定义
interface TableInfo {
  tableName: string;
  columns: ColumnInfo[];
}

interface ColumnInfo {
  name: string;
  dataType: string;
  constraints: string[];
  comment: string;
}

export default function Home() {
  const [sql, setSql] = useState('')
  const [diagram, setDiagram] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const generateDiagram = async () => {
    setIsLoading(true)
    setError('')
    setDiagram('')

    const parser = new Parser()
    try {
      const ast = parser.astify(sql)
      const tableInfo = extractTableInfo(ast, sql) // 传递原始 SQL 语句
      const mermaidCode = generateMermaidCode(tableInfo)
      
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'base',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis'
        },
        themeVariables: {
          primaryColor: '#f9f9f9',
          primaryTextColor: '#000',
          primaryBorderColor: '#000',
          lineColor: '#000',
          secondaryColor: '#fff',
          tertiaryColor: '#fff'
        }
      });
      const { svg } = await mermaid.render('mermaid-diagram', mermaidCode)
      setDiagram(svg)
    } catch (error) {
      console.error('Error generating diagram:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false)
    }
  }

  const extractTableInfo = (ast: AST | AST[], sql: string) => {
    const astArray = Array.isArray(ast) ? ast : [ast];

    // 使用正则表达式提取注释信息
    const commentRegex = /`(\w+)`\s+\w+.*COMMENT\s+'([^']+)'/gi
    const comments: { [key: string]: string } = {}
    let match
    while ((match = commentRegex.exec(sql)) !== null) {
      comments[match[1]] = match[2];
    }

    // 处理没有反引号的列名
    const commentRegexNoBackticks = /(\w+)\s+\w+.*COMMENT\s+'([^']+)'/gi
    while ((match = commentRegexNoBackticks.exec(sql)) !== null) {
      comments[match[1]] = match[2];
    }

    return astArray.filter(stmt => stmt.type === 'create').map(createStmt => {
      const tableName = createStmt.table?.[0]?.table || 'Unknown'
      const columns = createStmt.create_definitions?.map(def => {
        if (def.resource === 'column') {
          const columnName = (typeof def.column.column === 'string' 
            ? def.column.column 
            : def.column.column.expr.value) as string;
          const columnInfo = {
            name: columnName,
            dataType: def.definition.dataType,
            constraints: extractConstraints(def.definition),
            comment: comments[columnName] || ''
          }
          console.log('Column Info:', columnInfo)
          return columnInfo
        }
        return null
      }).filter((col): col is NonNullable<typeof col> => col !== null) || []

      return { tableName, columns }
    })
  }

  const extractConstraints = (columnDef: any) => {
    const constraints = []
    if (columnDef.primary_key) constraints.push('PK')
    if (columnDef.not_null) constraints.push('NOT NULL')
    if (columnDef.unique) constraints.push('UNIQUE')
    if (columnDef.default_val) constraints.push(`DEFAULT ${columnDef.default_val.value}`)
    return constraints
  }

  const generateMermaidCode = (tablesInfo: TableInfo[]) => {
    let code = 'erDiagram\n'
    tablesInfo.forEach(tableInfo => {
      code += `  ${tableInfo.tableName} {\n`
      tableInfo.columns.forEach(column => {
        code += `    ${column.dataType} ${column.name}`
        if (column.constraints.length > 0) {
          code += ` "${column.constraints.join(', ')}"`
        }
        if (column.comment) {
          code += ` "${column.comment}"`
        }
        code += '\n'
      })
      code += '  }\n'
    })
    console.log('Generated Mermaid Code:', code) // 添加日志信息
    return code
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <main className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 md:px-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            ER Diagram Generator
          </h1>
          <h2 className="text-xl md:text-2xl text-center text-gray-700 mb-8">
            Create Entity Relationship Diagrams from MySQL Statements
          </h2>
            <textarea
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="Enter your MySQL CREATE TABLE statement here..."
              rows={10}
              className="w-full mb-6 p-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />

            <div className="flex justify-center mb-8">
              <button 
                onClick={generateDiagram}
                disabled={isLoading}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition duration-150 ease-in-out"
              >
                {isLoading ? 'Generating...' : 'Generate Diagram'}
              </button>
            </div>

            {isLoading && <LoadingSpinner />}

            {error && <ErrorMessage message={error} />}

            {diagram && (
              <div className="mt-8 bg-gray-50 rounded-md overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-900 bg-gray-100 px-6 py-3">Generated ER Diagram</h2>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div onClick={openModal} className="cursor-pointer">
                    <div dangerouslySetInnerHTML={{ __html: diagram }} className="overflow-auto max-w-full" style={{ minHeight: '600px' }} />
                  </div>
                </div>
                <div className="mt-6 flex justify-center">
                  <DownloadButton svgContent={diagram} fileName="er_diagram.svg" />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
