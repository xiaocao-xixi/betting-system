/**
 * Next.js App Component - Application wrapper importing global styles
 * Next.js 应用组件 - 导入全局样式的应用包装器
 */
import type { AppProps } from 'next/app'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
