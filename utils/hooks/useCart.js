import {useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";

export const useCart = (initialValue) => {
    const cart = useSelector((state) => state.cart);

    const [state, setState] = useState({
        baseShippingCharge: 0,
        totalShippingCharge: 0,
        totalWeight: 0,
    });

    const convertToKilograms = useCallback((weightStr, quantity) => {
        if (typeof weightStr !== "string" || isNaN(parseFloat(quantity))) {
            return 0; // Invalid data
        }

        if (weightStr.toLowerCase().includes("kg")) {
            return parseFloat(weightStr) * quantity;
        } else if (weightStr.toLowerCase().includes("gm")) {
            return (parseFloat(weightStr) / 1000) * quantity;
        } else if (
            weightStr.toLowerCase().includes("liter") ||
            weightStr.toLowerCase().includes("litre")
        ) {
            return parseFloat(weightStr) * quantity;
        } else if (
            weightStr.toLowerCase().includes("l") &&
            !weightStr.toLowerCase().includes("ml")
        ) {
            return parseFloat(weightStr) * quantity;
        } else if (weightStr.toLowerCase().includes("ml")) {
            return (parseFloat(weightStr) / 1000) * quantity;
        } else {
            return 0; // Unsupported unit
        }
    }, []);

    const calculateTotalWeight = useCallback(
        (products) => {
            let total = 0;
            for (const product of products) {
                const weightInKilograms = convertToKilograms(
                    product.variant_quantity,
                    product.quantity
                );
                total += weightInKilograms;
            }
            return total;
        },
        [convertToKilograms]
    );

    const calculateShippingCharge = useCallback(
        (baseCharge, products) => {
            let totalWeight = calculateTotalWeight(products);
            let totalCharges = 0;
            let additionalCharge = 20;

            if (totalWeight <= 1) {
                totalCharges += baseCharge;
            } else {
                const additionalWeight = totalWeight - 1;
                const additionalCharges =
                    Math.ceil(additionalWeight) * additionalCharge;
                totalCharges = baseCharge + additionalCharges;
            }
            return {
                charge: totalCharges,
                weight: totalWeight,
            };
        },
        [calculateTotalWeight]
    );

    useEffect(() => {
        let items = [];

        cart.items.forEach((item) => {
            if (item.hasOwnProperty("type") && item["type"] === "combo") {
                item.items.forEach((i) => {
                    // console.log(i);
                    const obj = {
                        variant_quantity:
                          i.inventory_variants?.[0]?.variant_option?.name || "0gm",
                        quantity: (i?.quantity || 1) * (item?.quantity || 1),
                        // variant_quantity: "100gm",
                        // quantity: 1,
                    };
                    items.push(obj);
                });
            } else {
                const obj = {
                    variant_quantity: item.variant_quantity,
                    quantity: item.quantity,
                };
                items.push(obj);
            }
        });

        // console.log(items);

        let baseCharge = 0;

        if (cart.items.length === 0) {
            baseCharge = 0;
        } else if (
            cart.shippingAddress?.district?.name?.trim().toLowerCase() === "dhaka"
        ) {
            baseCharge = 60;
        } else {
            baseCharge = 120;
        }

        const total = calculateShippingCharge(baseCharge, items);

        setState((prevState) => ({
            ...prevState,
            baseShippingCharge: baseCharge,
            totalShippingCharge: total.charge,
            totalWeight: total.weight,
        }));
    }, [cart]);

    return {
        baseShippingCharge: state.baseShippingCharge,
        totalShippingCharge: state.totalShippingCharge,
        totalWeight: state.totalWeight,
    };
};
