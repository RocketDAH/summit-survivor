import "@/design-system/index.css";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pixel-min-h-screen pixel-flex-center" style={{ backgroundColor: "var(--color-background)" }}>
      {children}
    </div>
  );
}
