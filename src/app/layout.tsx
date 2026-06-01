import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Summit Survivor',
  description: '2분 타임어택 생존 클리커 게임',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, fontFamily: 'monospace' }}>
        {children}
      </body>
    </html>
  )
}