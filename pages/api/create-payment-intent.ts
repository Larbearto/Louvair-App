import Stripe from 'stripe'
import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { AddCartType } from '@/types/AddCartType'
import { prisma } from '@/util/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2023-10-16',
})

interface Item {
	name: string
	description?: string
	unit_amount: string
	quantity: number
	image?: string
}

const calculateOrderAmount = (items: AddCartType[]) => {
	const totalPrice = items.reduce((acc, item) => {
		return acc + item.unit_amount! * item.quantity!
	}, 0)
	return totalPrice
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// get user
	const userSession = await getServerSession(req, res, authOptions)
	if (!userSession?.user) {
		res.status(403).json({ message: 'Not logged in' })
		return
	}
	// Extract the data from the body
	const { items, payment_intent_id } = req.body
	console.log(items, payment_intent_id)

	// Create the order data, "PRISMA CODE DB" // Data necessary for creating the payment_intent_id
	const orderData = {
		user: { connect: { id: userSession.user?.id } },
		amount: calculateOrderAmount(items),
		currency: 'usd',
		status: 'pending',
		paymentIntentID: payment_intent_id,
		products: {
			create: items.map((item: Item) => ({
				name: item.name,
				description: item.description || null,
				unit_amount: parseFloat(item.unit_amount),
				image: item.image,
				quantity: item.quantity,
			})),
		},
	}

	//  Check if the payment intent exists then update the order
	if (payment_intent_id) {
		const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id)
		if (current_intent) {
			const updated_intent = await stripe.paymentIntents.update(payment_intent_id, {
				amount: calculateOrderAmount(items),
			})
			// Fetch order with product ids
			const existing_order = await prisma.order.findFirst({
				where: { paymentIntentID: updated_intent.id },
				include: { products: true },
			})
			if (!existing_order) {
				res.status(400).json({ message: 'Invalid Payment Intent' })
			}

			// Update Existing Order
			const updated_order = await prisma.order.update({
				where: { id: existing_order?.id },
				data: {
					amount: calculateOrderAmount(items),
					products: {
						deleteMany: {},
						create: items.map((item: Item) => ({
							name: item.name,
							description: item.description || null,
							unit_amount: parseFloat(item.unit_amount),
							image: item.image,
							quantity: item.quantity,
						})),
					},
				},
			})
			res.status(200).json({ paymentIntent: updated_intent })
			return
		}
	} else {
		// Create a new order with prisma and return the orderData to the client
		const paymentIntent = await stripe.paymentIntents.create({
			amount: calculateOrderAmount(items),
			currency: 'usd',
			automatic_payment_methods: { enabled: true },
		})

		orderData.paymentIntentID = paymentIntent.id
		const newOrder = await prisma.order.create({
			data: orderData,
		})
		// Data necessary for the order
		res.status(200).json({ paymentIntent })
	}
}
