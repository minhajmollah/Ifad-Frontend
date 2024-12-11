import {createSlice} from '@reduxjs/toolkit'

const CartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        subTotal: 0,
        shippingCharge: 0,
        discount: 0,
        tax: 0,
        grandTotal: 0,
        billingAddress: '',
        shippingAddress: '',
        paymentMethodId: '',
    },
    reducers: {
        SET_CART_ITEM: (state, action) => {
            let newItem = action.payload;

            let isExists = state.items.some((item) => {
                if (newItem.inventory_id) {
                    return item.inventory_id === newItem.inventory_id;
                } else if (newItem.combo_id) {
                    return item.combo_id === newItem.combo_id;
                }
                return false;
            });

            if (isExists) {
                state.items = state.items.map((item) => {
                    if ((newItem.inventory_id && item.inventory_id === newItem.inventory_id) ||
                        (newItem.combo_id && item.combo_id === newItem.combo_id)) {
                        item.quantity += newItem.quantity;
                        item.total = item.quantity * item.unit_price;
                    }
                    return item;
                });
            } else {
                state.items.push(newItem);
            }

            CALC_SUB_TOTAL(state);
        },
        UPDATE_ITEM_QUANTITY: (state, action) => {
            let {key, quantity} = action.payload;

            state.items = state.items.filter((item, index) => {
                if (index === key) {
                    item.quantity = quantity;
                    item.total = quantity * item.unit_price;
                }

                return item;
            });

            CALC_SUB_TOTAL(state);
        },
        UPDATE_PAYMENT_METHOD_ID: (state, action) => {
            state.paymentMethodId = action.payload
        },
        UPDATE_BILLING_ADDRESS: (state, action) => {
            state.billingAddress = action.payload
        },
        UPDATE_SHIPPING_ADDRESS: (state, action) => {
            state.shippingAddress = action.payload
        },
        REMOVE_CART_ITEM: (state, action) => {
            const key = action.payload;
            state.items = state.items.filter((item, index) => index !== key);
            CALC_SUB_TOTAL(state);
        },
        RESET_CART: (state, action) => {
            state.items = [];
            state.subTotal = 0;
            state.shippingCharge = 0;
            state.discount = 0;
            state.tax = 0;
            state.grandTotal = 0;
            state.billingAddress = "";
            state.shippingAddress = "";
            state.paymentMethodId = "";
        }
    }
});

function CALC_SUB_TOTAL(state) {
    let tmp = 0;
    state.items.map((item) => tmp += item.total);

    state.subTotal = tmp;
    state.grandTotal = tmp + state.shippingCharge;
}

export const {
    RESET_CART,
    SET_CART_ITEM,
    UPDATE_ITEM_QUANTITY,
    UPDATE_PAYMENT_METHOD_ID,
    REMOVE_CART_ITEM,
    UPDATE_BILLING_ADDRESS,
    UPDATE_SHIPPING_ADDRESS
} = CartSlice.actions

export default CartSlice.reducer;
