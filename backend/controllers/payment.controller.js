import {stripe} from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";


export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "No products found" });
        }
        let totalAmount = 0;
        const lineitems = products.map((product) => {
            const amount = Math.round(product.price * 100);
            totalAmount += amount * product.quantity;
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            };
        });

        //check for the coupon 

        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (!coupon) {
                totalAmount -= Math.round(totalamount * coupon.discountPercentage / 100);
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineitems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-canceled`,
            discount: coupon
                ? [
                    {
                        coupon: await createStripeCoupon(coupon.discountPercentage),
                    },
                ]
                : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
            },
        });
        if (totalAmount >= 20000) {
            const coupon = await stripe.coupons.create({
                percent_off: discountPercentage,
                duration: "once",
            });
        }
        res.status(200).json({
            id: session.id,
            totalAmount: totalAmount/100,
        })
    } catch (error) {

    }
}

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        duration: "once",
        percent_off: discountPercentage,
    });

}


async function createOrder(userId) {
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).slice(2, 10).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId
    })
    await newCoupon.save();
    return newCoupon;
}