const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: [true, 'Order item must be linked to a product ID.']
    },
    name: {
        type: String,
        required: [true, 'Order item must have a name.']
    },
    price: {
        type: Number, 
        required: [true, 'Order item must have a price.'],
        min: [0, 'Price cannot be negative.']
    },
    quantity: {
        type: Number,
        required: [true, 'Order item must have a quantity.'],
        min: [1, 'Quantity must be at least 1.']
    }
});

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user.']
    },
    items: {
        type: [OrderItemSchema], 
        required: [true, 'Order cannot be empty.'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'An order must contain at least one item.'
        }
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required.'],
        min: [0, 'Total amount cannot be negative.']
    },
    shippingAddress: {
        street: { 
            type: String, 
            required: [true, 'Shipping street address is required.'] 
        },
        city: { 
            type: String, 
            required: [true, 'Shipping city is required.'] 
        },
        country: { 
            type: String, 
            required: [true, 'Shipping country is required.'] 
        }
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required.'],
        enum: {
            values: ['Cash on Delivery', 'E-Sewa'],
            message: '{VALUE} is not a supported payment method.'
        }
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    paidAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Order', OrderSchema);
