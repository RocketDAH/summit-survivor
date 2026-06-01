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
      <head>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'monospace' }}>
        {children}
      </body>
    </html>
  )
}