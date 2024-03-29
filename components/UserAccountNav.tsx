'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'

import { User } from 'next-auth'
import { UserAvatar } from './UserAvatar'
import { signOut } from 'next-auth/react'

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
	user: Pick<User, 'name' | 'image' | 'email'>
}

export function UserAccountNav({ user }: UserAccountNavProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				{/* <UserAvatar
					user={{ name: user.name || null, image: user.image || null }}
					className='h-9 w-9'
				/> */}
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-zinc-300' align='end'>
				<div className='flex items-center justify-start gap-2 p-2'>
					{/* <div className='flex flex-col space-y-1 leading-none'>
						{user.name && <p className='font-medium'>{user.name}</p>}
						{user.email && (
							<p className='w-[200px] truncate text-sm text-muted-foreground'>
								{user.email}
							</p>
						)}
					</div> */}
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href='/'>Feed</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link href='/r/create'>Create Community</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link href='/settings'>Settings</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className='cursor-pointer' onSelect={() => signOut()}>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserAccountNav
