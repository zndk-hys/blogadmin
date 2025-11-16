import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
