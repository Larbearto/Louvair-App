'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useThemeStore } from '../../store'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

export default function Hydrate({ children }: { children: ReactNode }) {
	const [isHydrated, setIsHydrated] = useState(false)
	const themeStore = useThemeStore()

	// Waits til Nextjs rehydration completes
	useEffect(() => {
		setIsHydrated(true)
	}, [])

	return (
		<SessionProvider>
			{isHydrated ? (
				<body
					className='px-4 lg:px-48 font-roboto min-h-screen bg-background antialiased'
					data-theme={themeStore.mode}
				>
					<ThemeProvider attribute='class'>{children}</ThemeProvider>
				</body>
			) : (
				<body></body>
			)}
		</SessionProvider>
	)
}
