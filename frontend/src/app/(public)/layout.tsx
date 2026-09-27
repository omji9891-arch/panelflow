export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="cal-ui-shell min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6">
      {children}
    </div>
  );
}
