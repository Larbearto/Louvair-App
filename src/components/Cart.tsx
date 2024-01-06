'use client'

import Image from 'next/image'
import { useCartStore } from '../../store'
import formatPrice from '@/lib/PriceFormat'
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import Checkout from './Checkout'
import OrderConfirmed from './OrderConfirmed'
import ShoppingBag from '../../public/shoppingbag.png'

export default function Cart() {
	const cartStore = useCartStore()

	//Total Price
	const totalPrice = cartStore.cart.reduce((acc, item) => {
		return acc + item.unit_amount! * item.quantity!
	}, 0)

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={() => cartStore.toggleCart()}
				className='fixed w-full h-screen  left-0 top-0 bg-zinc-900/90'
			>
				{/* Cart */}
				<motion.div
					layout
					onClick={(e) => e.stopPropagation()}
					className='bg-zinc-200/10 absolute right-0 top-0  h-screen p-12 overflow-y-scroll  w-full lg:w-2/5'
				>
					{cartStore.onCheckout === 'cart' && (
						<button
							onClick={() => cartStore.toggleCart()}
							className='text-sm font-bold pb-12 underline'
						>
							Back to store
						</button>
					)}
					{cartStore.onCheckout === 'checkout' && (
						<button
							onClick={() => cartStore.setCheckout('cart')}
							className='text-sm font-bold pb-12'
						>
							Check your cart 🛒
						</button>
					)}
					{/* Cart Items */}
					{cartStore.onCheckout === 'cart' && (
						<>
							{cartStore.cart.map((item) => (
								<motion.div
									layout
									key={item.id}
									className='flex p-4 gap-4 bg-blue-500 my-4 rounded-lg '
								>
									<Image
										className='rounded-md h-24'
										src={item.image}
										alt={item.name}
										width={120}
										height={120}
									/>
									<div>
										<h2>{item.name}</h2>
										{/* Update quantity of a product */}
										<div className='flex gap-2'>
											<h2>Quantity: {item.quantity}</h2>
											<button
												onClick={() =>
													cartStore.removeProduct({
														id: item.id,
														image: item.image,
														name: item.name,
														unit_amount: item.unit_amount,
														quantity: item.quantity,
													})
												}
											>
												<IoRemoveCircle />
											</button>
											<button
												onClick={() =>
													cartStore.addProduct({
														id: item.id,
														image: item.image,
														name: item.name,
														unit_amount: item.unit_amount,
														quantity: item.quantity,
													})
												}
											>
												<IoAddCircle />
											</button>
										</div>

										<p className='text-sm'>
											{item.unit_amount && formatPrice(item.unit_amount)}
										</p>
									</div>
								</motion.div>
							))}
						</>
					)}
					{/* Checkout and total */}
					{cartStore.cart.length > 0 && cartStore.onCheckout === 'cart' ? (
						<motion.div layout>
							<p>Total: {formatPrice(totalPrice)}</p>
							<button
								onClick={() => cartStore.setCheckout('checkout')}
								className='py-2 mt-4 bg-zinc-00/90 w-full rounded-md text-white'
							>
								Checkout
							</button>
						</motion.div>
					) : null}
					{/* Checkout Form */}
					{cartStore.onCheckout === 'checkout' && <Checkout />}
					{cartStore.onCheckout === 'success' && <OrderConfirmed />}
					<AnimatePresence>
						{!cartStore.cart.length && cartStore.onCheckout === 'cart' && (
							<motion.div
								animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
								initial={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
								exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
								className='flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75'
							>
								<h1>You have 0 items in your bag...</h1>
								<Image
									src={ShoppingBag}
									alt='empty cart'
									width={200}
									height={200}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</>
	)
}
