import type { Metadata } from "next";
import "@/design-system/index.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "정상까지 | Summit Survivor",
  description: "히말라야 정상을 향한 2분간의 생존 등반 게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
