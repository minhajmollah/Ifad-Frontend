import React, { Fragment, useEffect, useState } from "react";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import Image from "next/image";
import Payment from "../../public/payment.jpg";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "../../public/card.jpg";
import BankTransfer from "../../public/bank-transfer.png";
import Mobile from "../../public/mobile.jpeg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAddresses,
  updateDefaultBillingAddress,
  updateDefaultShippingAddress,
} from "../../services/AddressServices";
import { getAddressToString, makeTitle, tostify } from "../../utils/helpers";
import { toast } from "react-toastify";
import {
  makePayment,
  saveOrder,
  checkCoupon,
  fetchConditionalDiscounts
} from "../../services/OrderServices";
import { fetchPaymentMethods } from "../../services/PaymentMethodServices";
import {
  RESET_CART,
  UPDATE_BILLING_ADDRESS,
  UPDATE_PAYMENT_METHOD_ID,
  UPDATE_SHIPPING_ADDRESS,
} from "../../store/slices/CartSlice";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "../../utils/hooks/useCart";
import Head from "next/head";
import { Oval } from "react-loader-spinner";
import { saveAddress, editAddress } from "../../services/AddressServices";
import withAuth from "../../utils/HOC/withAuth";
import { API_URL } from "../../utils/constants";

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);

  const [agree, setAgree] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [isShippingSameAsBilling, setIsShippingSameAsBilling] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { totalShippingCharge, totalWeight } = useCart(null);

  const [coupon, setCoupon] = useState({
    code: "",
    appliedCode: "",
    isChecking: false,
    isApplied: false,
    discount: cart?.discount || 0,
    shipping_charge: totalShippingCharge !== null ? totalShippingCharge : 0,
  });

  // const [discount, setDiscount] = useState({
  //   conditionName: "",
  //   conditionType: "",
  //   discountDescription: "",
  //   discountAmount: 0,
  //   shippingCharge: 0,
  //   isApplied: false,
  // });

  const [discount, setDiscount] = useState([]);

  const [conditionalDiscount, setConditionalDiscount] = useState([]);

  useEffect(() => {
    fetchConditionalDiscounts().then((response) => {
      if (response?.data?.length) {
        // console.log(response.data)
        setConditionalDiscount(
          response.data.map(item => ({
            condition_name: item.condition_name,
            condition_exp_date: item.condition_exp_date,
            condition_type: item.condition_type,
            customer_group: item.customer_group,
            discount_amount: item.discount_amount,
            district_id: item.district_id,
            upazila_id: item.upazila_id,
            is_exclude_sale: item.is_exclude_sale,
            min_spend: item.min_spend,
            max_spend: item.max_spend,
          }))
        );
      }
    });
  }, []);

  const applyDiscount = (subtotal, shippingCharge, districtId, upazilaId, customerGroups) => {
    // console.log(conditionalDiscount)
    let discount = [];

    // Iterate through each discount condition
    conditionalDiscount.forEach((condition) => {
      // Check if the condition is still valid (i.e., not expired)
      const currentDate = new Date();
      const expiryDate = new Date(condition.condition_exp_date);
      if (currentDate <= expiryDate) {
        // Check if the conditions match
        const districtIds = JSON.parse(condition?.district_id);
        const upazilaIds = JSON.parse(condition?.upazila_id);
        const minSpend = condition?.min_spend
          ? parseFloat(condition.min_spend)
          : 0;
        const maxSpend = condition?.max_spend
          ? parseFloat(condition.max_spend)
          : Infinity;
        const conditionCustomerGroups = JSON.parse(condition.customer_group);

          const customerGroupsIds = customerGroups?.length ? new Set(customerGroups.map(item => item.id)) : [];

          const conditionCustomerGroupsIntegers = new Set(conditionCustomerGroups.map(idStr => parseInt(idStr, 10)));

          const commonIds = [...customerGroupsIds].filter(id => conditionCustomerGroupsIntegers.has(id));

        if (
          (districtIds.length === 0 || (districtId && districtIds.includes(districtId.toString()))) &&
          (upazilaIds.length === 0 || (upazilaId && upazilaIds.includes(upazilaId.toString()))) &&
          subtotal >= minSpend &&
          subtotal <= maxSpend &&
          (conditionCustomerGroups?.length === 0 || commonIds.length > 0)
        ) {
          // Apply discount based on the condition type
          if (condition.condition_type === "fixed_percentage_discount") {
            const percentageDiscount = parseFloat(condition?.discount_amount || 0);
            let obj = {
              conditionName: condition.condition_name,
              conditionType: condition.condition_type,
              discountDescription: condition.condition_name,
              discountAmount: (subtotal) * (percentageDiscount / 100),
            }
            discount.push(obj)
          } else if (condition.condition_type === "fixed_amount_discount") {
            let obj = {
              conditionName: condition.condition_name,
              conditionType: condition.condition_type,
              discountDescription: condition.condition_name,
              discountAmount: parseFloat(condition.discount_amount),
            }
            discount.push(obj)
          } else if (condition.condition_type === "free_delivery") {
            let obj = {
              conditionName: condition.condition_name,
              conditionType: condition.condition_type,
              discountDescription: condition.condition_name,
              discountAmount: 0,
              shippingCharge: 0,
            }
            discount.push(obj)
          }
        }
      }
    });

    return discount;
  };

  useEffect(() => {
    const subtotal = cart.subTotal;
    const totalShippingCharge = coupon?.shipping_charge;
    const districtId = shippingAddress?.district?.id;
    const upazilaId = shippingAddress?.upazila?.id;

    // Calculate the discount based on the conditions
    const additionalDiscount = applyDiscount(subtotal, totalShippingCharge, districtId, upazilaId, auth.group);
    setDiscount(additionalDiscount)
  }, [cart?.items, conditionalDiscount, shippingAddress])

  useEffect(() => {
    setCoupon((prevCoupon) => ({
      ...prevCoupon,
      shipping_charge:
        shippingAddress && Object.keys(shippingAddress).length !== 0
          ? totalShippingCharge
          : null,
    }));
  }, [totalShippingCharge, shippingAddress, isShippingSameAsBilling]);

  useEffect(() => {
    setCoupon((prev) => ({
      ...prev,
      code: "",
      appliedCode: "",
      isChecking: false,
      isApplied: false,
      discount: cart?.discount || 0,
      shipping_charge: totalShippingCharge,
    }));
  }, [cart?.items]);

  useEffect(() => {
    fetchPaymentMethods().then((response) => {
      if (response?.data) {
        setPaymentMethods(response.data);
      }
    });
  }, []);

  const fetchAddressesData = () => {
    fetchAddresses().then((response) => {
      if (response?.data) {
        setAddresses(response.data);
      }
    });
  };

  useEffect(() => {
    fetchAddressesData();
  }, []);

  useEffect(() => {
    if (addresses.length > 0) {
      addresses.map((address) => {
        if (address.is_default_billing) {
          setBillingAddress(address);
          dispatch(UPDATE_BILLING_ADDRESS(address));
          setIsFetched((prev) => ({
            ...prev,
            districtsBilling: false,
            upazilasBilling: false,
          }));
        }
        if (address.is_default_billing && isShippingSameAsBilling) {
          setShippingAddress(address);
          dispatch(UPDATE_SHIPPING_ADDRESS(address));
          setIsFetched((prev) => ({
            ...prev,
            districtsShipping: false,
            upazilasShipping: false,
          }));
        } else if (!isShippingSameAsBilling && address.is_default_shipping) {
          setShippingAddress(address);
          dispatch(UPDATE_SHIPPING_ADDRESS(address));
          setIsFetched((prev) => ({
            ...prev,
            districtsShipping: false,
            upazilasShipping: false,
          }));
        }
      });
    }
  }, [addresses]);

  const handleSetDefaultBillingAddress = (event, id) => {
    event.preventDefault();

    if (id) {
      updateDefaultBillingAddress(id).then((response) => {
        if (response.status) {
          tostify(toast, "success", response);
          fetchAddressesData();
          setCoupon((prev) => ({
            ...prev,
            code: "",
            appliedCode: "",
            isChecking: false,
            isApplied: false,
            discount: cart?.discount || 0,
            shipping_charge: totalShippingCharge,
          }));
        }
      });
    }
    // else {
    //   setBillingAddress({});
    //   setAddressStatus((prev) => ({
    //     ...prev,
    //     billing: { ...prev.billing, isCreatable: true, isEditable: false },
    //   }));
    // }
  };

  const handleSetDefaultShippingAddress = (event, id) => {
    event.preventDefault();

    if (id) {
      updateDefaultShippingAddress(id).then((response) => {
        if (response.status) {
          tostify(toast, "success", response);
          fetchAddressesData();
          setCoupon((prev) => ({
            ...prev,
            code: "",
            appliedCode: "",
            isChecking: false,
            isApplied: false,
            discount: cart?.discount || 0,
            shipping_charge: totalShippingCharge,
          }));
        }
      });
    }
    // else {
    //   setShippingAddress({});
    //   setAddressStatus((prev) => ({
    //     ...prev,
    //     shipping: { ...prev.shipping, isCreatable: true, isEditable: false },
    //   }));
    // }
  };

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (cart.items && cart.items.length < 1) {
      alert("The cart shouldn't be empty!");
      return;
    }

    if (!agree) {
      alert(
        "Please accept the terms & conditions, refund policy & privacy policy."
      );
      return;
    }

    if (!cart?.paymentMethodId) {
      alert("Please choose a payment method!");
      return;
    }

    // console.log(billingAddress, shippingAddress)
    // return

    if (!Object.keys(billingAddress).length > 0) {
      alert("Please select a billing address!");
      return;
    }

    if (Object.keys(billingAddress).length > 0 && addresses.length === 0) {
      alert("Please select a billing address!");
      return;
    }

    if (!Object.keys(shippingAddress).length > 0) {
      alert("Please select a shipping address!");
      return;
    }

    if (Object.keys(shippingAddress).length > 0 && addresses.length === 0) {
      alert("Please select a shipping address!");
      return;
    }

    setIsLoading(true);

    if (cart.paymentMethodId === "1") {
      // console.log({
      //   shipping_address: isShippingSameAsBilling
      //     ? getAddressToString(billingAddress)
      //     : getAddressToString(shippingAddress),
      //   shipping_address_json: isShippingSameAsBilling
      //     ? billingAddress
      //     : shippingAddress,
      //   billing_address: getAddressToString(billingAddress),
      //   billing_address_json: billingAddress,
      //   cart: cart.items,
      //   sub_total: cart.subTotal,
      //   // discount: cart.discount,
      //   discount: coupon?.discount + totalDiscount || 0,
      //   // shipping_charge: totalShippingCharge,
      //   shipping_charge: hasFreeShipping ? 0 : coupon?.shipping_charge,
      //   tax: cart.tax,
      //   grand_total: cart.subTotal + (hasFreeShipping ? 0 : coupon?.shipping_charge || 0) - (coupon?.discount + totalDiscount || 0),
      //   // grand_total: cart.subTotal + coupon?.shipping_charge - coupon?.discount,
      //   payment_method_id: cart.paymentMethodId,
      //   total_weight: totalWeight,
      //   coupon_code: coupon?.appliedCode || "",
      //   customer_id: auth?.id,
      // });
      // setIsLoading(false);
      // return;
      makePayment({
        shipping_address: isShippingSameAsBilling
          ? getAddressToString(billingAddress)
          : getAddressToString(shippingAddress),
        shipping_address_json: isShippingSameAsBilling
          ? billingAddress
          : shippingAddress,
        billing_address: getAddressToString(billingAddress),
        billing_address_json: billingAddress,
        cart: cart.items,
        sub_total: cart.subTotal,
        // discount: cart.discount,
        discount: coupon?.discount + totalDiscount || 0,
        // shipping_charge: totalShippingCharge,
        shipping_charge: hasFreeShipping ? 0 : coupon?.shipping_charge,
        tax: cart.tax,
        grand_total: cart.subTotal + (hasFreeShipping ? 0 : coupon?.shipping_charge || 0) - (coupon?.discount + totalDiscount || 0),
        // grand_total: cart.subTotal + coupon?.shipping_charge - coupon?.discount,
        payment_method_id: cart.paymentMethodId,
        total_weight: totalWeight,
        coupon_code: coupon?.appliedCode || "",
        customer_id: auth?.id,
      }).then((response) => {
        if (response?.data?.GatewayPageURL) {
          // tostify(toast, 'success', response);

          dispatch(RESET_CART());
          setIsLoading(false);

          window.location.href = response?.data?.GatewayPageURL;
        }
      });
    } else {
      saveOrder({
        shipping_address: isShippingSameAsBilling
          ? getAddressToString(billingAddress)
          : getAddressToString(shippingAddress),
        shipping_address_json: isShippingSameAsBilling
          ? billingAddress
          : shippingAddress,
        billing_address: getAddressToString(billingAddress),
        billing_address_json: billingAddress,
        cart: cart.items,
        sub_total: cart.subTotal,
        // discount: cart.discount,
        // discount: coupon?.discount,
        discount: coupon?.discount + totalDiscount || 0,
        // shipping_charge: totalShippingCharge,
        // shipping_charge: coupon?.shipping_charge,
        shipping_charge: hasFreeShipping ? 0 : coupon?.shipping_charge,
        tax: cart.tax,
        // grand_total: cart.subTotal + totalShippingCharge - coupon?.discount,
        // grand_total: cart.subTotal + coupon?.shipping_charge - coupon?.discount,
        grand_total: cart.subTotal + (hasFreeShipping ? 0 : coupon?.shipping_charge || 0) - (coupon?.discount + totalDiscount || 0),
        payment_method_id: cart.paymentMethodId,
        total_weight: totalWeight,
        coupon_code: coupon?.appliedCode || "",
        customer_id: auth?.id,
      }).then((response) => {
        if (response?.data?.status) {
          tostify(toast, "success", response);

          dispatch(RESET_CART());
          setIsLoading(false);

          setTimeout(() => {
            router.push("/my-account?tab=order&order_status=success");
          }, 1000);
        }
      });
    }
  };

  const handlePaymentMethodId = (id) => {
    try {
      dispatch(UPDATE_PAYMENT_METHOD_ID(id));
    } catch (err) {
      tostify(toast, "success", {
        message: err.message,
      });
    }
  };

  const handleSendCoupon = (e) => {
    e.preventDefault();

    if (cart.items && cart.items.length < 1) {
      alert("The cart shouldn't be empty!");
      return;
    }

    if (!billingAddress || Object.keys(billingAddress).length === 0) {
      alert("Please select a billing address");
      return;
    }

    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      alert("Please select a shipping address");
      return;
    }

    setCoupon((prev) => ({
      ...prev,
      isChecking: true,
    }));

    let items = [];

    cart.items.forEach((item) => {
      if (item.hasOwnProperty("type") && item["type"] === "combo") {
        const obj = {
          type: item?.type,
          combo_id: item?.combo_id,
          quantity: item?.quantity,
          unit_price: item?.unit_price,
          total: item?.total,
          category_id: item?.categoryId,
        };
        items.push(obj);
      } else {
        const obj = {
          type: item?.type,
          inventory_id: item?.inventory_id,
          quantity: item?.quantity,
          unit_price: item?.unit_price,
          total: item?.total,
          category_id: item?.categoryId,
        };
        items.push(obj);
      }
    });

    checkCoupon({
      coupon_code: coupon?.code,
      sub_total: cart.subTotal,
      shipping_charge: totalShippingCharge,
      grand_total: cart.subTotal + totalShippingCharge,
      customer_id: auth?.id,
      cart: items,
      shipping_address: isShippingSameAsBilling
        ? getAddressToString(billingAddress)
        : getAddressToString(shippingAddress),
      shipping_address_json: isShippingSameAsBilling
        ? billingAddress
        : shippingAddress,
      billing_address: getAddressToString(billingAddress),
      billing_address_json: billingAddress,
      tax: cart.tax,
      total_weight: totalWeight,
    }).then((response) => {
      setTimeout(() => {
        if (response?.data?.discount_coupon_amount) {
          if (
            response?.data?.coupon_discount_type ===
              "Percentage_wise_Discount" ||
            response?.data?.coupon_discount_type === "Fixed_Product_Discount"
          ) {
            const dis =
              response?.data?.previous_subtotal - response?.data?.sub_total;
            const shippingCharge = response?.data?.shipping_charge;
            if (
              dis - shippingCharge >
              coupon?.discount - coupon?.shipping_charge
            ) {
              setCoupon((prev) => ({
                ...prev,
                code: "",
                appliedCode: prev?.code,
                discount: Math.floor(dis),
                isChecking: false,
                isApplied: true,
                shipping_charge: shippingCharge,
              }));
            } else {
              setCoupon((prev) => ({
                ...prev,
                code: "",
                isChecking: false,
              }));
            }
          } else if (
            response?.data?.coupon_discount_type === "Fixed_Amount_Discount"
          ) {
            const match = response?.data?.discount_coupon_amount.match(/\d+/);
            const dis = match ? parseInt(match[0], 10) : 0;
            const shippingCharge = response?.data?.shipping_charge;

            if (
              dis - shippingCharge >
              coupon?.discount - coupon?.shipping_charge
            ) {
              setCoupon((prev) => ({
                ...prev,
                code: "",
                appliedCode: prev?.code,
                discount: Math.floor(dis),
                isChecking: false,
                isApplied: true,
                shipping_charge: shippingCharge,
              }));
            } else {
              setCoupon((prev) => ({
                ...prev,
                code: "",
                isChecking: false,
              }));
            }
          }

          // dispatch(RESET_CART());
          // setIsLoading(false);

          // window.location.href = response?.data?.GatewayPageURL;
        } else {
          setCoupon((prev) => ({
            ...prev,
            isChecking: false,
          }));
          tostify(toast, "error", response);
        }
      }, 2000);
    });
  };

  const handleRemoveCoupon = (e) => {
    e.preventDefault();
    setCoupon((prev) => ({
      ...prev,
      code: "",
      appliedCode: "",
      isChecking: false,
      isApplied: false,
      discount: cart?.discount || 0,
      shipping_charge: totalShippingCharge,
    }));
  };

  // custom address
  const [isFetched, setIsFetched] = useState({
    divisions: false,
    districtsBilling: false,
    upazilasBilling: false,
    districtsShipping: false,
    upazilasShipping: false,
  });

  const [divisions, setDivisions] = useState([]);
  const [districtsBilling, setDistrictsBilling] = useState([]);
  const [upazilasBilling, setUpazilasBilling] = useState([]);
  const [districtsShipping, setDistrictsShipping] = useState([]);
  const [upazilasShipping, setUpazilasShipping] = useState([]);

  useEffect(() => {
    if (!isFetched?.divisions) {
      fetch(`${API_URL}/ecom/divisions`)
        .then((response) => response.json())
        .then((data) => {
          setDivisions(data);
        })
        .catch((error) => console.error("Error fetching divisions:", error));

      setIsFetched((prev) => ({
        ...prev,
        divisions: true,
      }));
    }

    if (!isFetched?.districtsBilling && billingAddress?.division?.id) {
      fetch(
        `${API_URL}/ecom/districts/divisions/${billingAddress?.division?.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDistrictsBilling(data);
        })
        .catch((error) => console.error("Error fetching divisions:", error));

      setIsFetched((prev) => ({
        ...prev,
        districtsBilling: true,
      }));
    }

    if (!isFetched?.upazilasBilling && billingAddress?.district?.id) {
      fetch(
        `${API_URL}/ecom/upazilas/districts/${billingAddress?.district?.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setUpazilasBilling(data);
        })
        .catch((error) => console.error("Error fetching divisions:", error));

      setIsFetched((prev) => ({
        ...prev,
        upazilasBilling: true,
      }));
    }

    if (!isFetched?.districtsShipping && shippingAddress?.division?.id) {
      fetch(
        `${API_URL}/ecom/districts/divisions/${shippingAddress?.division?.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDistrictsShipping(data);
        })
        .catch((error) => console.error("Error fetching divisions:", error));

      setIsFetched((prev) => ({
        ...prev,
        districtsShipping: true,
      }));
    }

    if (!isFetched?.upazilasShipping && shippingAddress?.district?.id) {
      fetch(
        `${API_URL}/ecom/upazilas/districts/${shippingAddress?.district?.id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setUpazilasShipping(data);
        })
        .catch((error) => console.error("Error fetching divisions:", error));

      setIsFetched((prev) => ({
        ...prev,
        upazilasShipping: true,
      }));
    }
  }, [billingAddress, shippingAddress]);

  const handleDivisionBillingChange = async (e, selectedDivision) => {
    e.preventDefault();

    setBillingAddress((prev) => ({
      ...prev,
      division: selectedDivision,
      district: {},
      upazila: {},
    }));

    const response = await fetch(
      `${API_URL}/ecom/districts/divisions/${e.target.value}`
    );
    const districts = await response.json();
    setDistrictsBilling(districts);
    setUpazilasBilling([]);
  };

  const handleDistrictBillingChange = async (e, selectedDistrict) => {
    e.preventDefault();

    setBillingAddress((prev) => ({
      ...prev,
      district: selectedDistrict,
      upazila: {},
    }));

    const response = await fetch(
      `${API_URL}/ecom/upazilas/districts/${e.target.value}`
    );
    const upazilas = await response.json();
    setUpazilasBilling(upazilas);
  };

  const handleUpazilaBillingChange = (e, selectedUpazila) => {
    e.preventDefault();

    setBillingAddress((prev) => ({
      ...prev,
      upazila: selectedUpazila,
    }));
  };

  const handleDivisionShippingChange = async (e, selectedDivision) => {
    e.preventDefault();

    setShippingAddress((prev) => ({
      ...prev,
      division: selectedDivision,
      district: {},
      upazila: {},
    }));

    const response = await fetch(
      `${API_URL}/ecom/districts/divisions/${e.target.value}`
    );
    const districts = await response.json();
    setDistrictsShipping(districts);
    setUpazilasShipping([]);
  };

  const handleDistrictShippingChange = async (e, selectedDistrict) => {
    e.preventDefault();

    setShippingAddress((prev) => ({
      ...prev,
      district: selectedDistrict,
      upazila: {},
    }));

    const response = await fetch(
      `${API_URL}/ecom/upazilas/districts/${e.target.value}`
    );
    const upazilas = await response.json();
    setUpazilasShipping(upazilas);
  };

  const handleUpazilaShippingChange = (e, selectedUpazila) => {
    e.preventDefault();

    setShippingAddress((prev) => ({
      ...prev,
      upazila: selectedUpazila,
    }));
  };

  const handleShippingSameAsBilling = async (e) => {
    setIsShippingSameAsBilling((current) => {
      if (!current) {
        setShippingAddress(billingAddress);
        dispatch(UPDATE_SHIPPING_ADDRESS(billingAddress));
      } else {
        fetchAddressesData();
      }
      return !current;
    });
  };

  const [addressStatus, setAddressStatus] = useState({
    billing: {
      isCreatable: addresses && addresses.length === 0,
      isEditable: !(addresses && addresses.length === 0),
      isUpdating: false,
    },
    shipping: {
      isCreatable: addresses && addresses.length === 0,
      isEditable: !(addresses && addresses.length === 0),
      isUpdating: false,
    },
  });

  useEffect(() => {
    setAddressStatus({
      billing: {
        isCreatable: addresses && addresses.length === 0,
        isEditable: !(addresses && addresses.length === 0),
        isUpdating: addresses && addresses.length === 0,
      },
      shipping: {
        isCreatable: addresses && addresses.length === 0,
        isEditable: !(addresses && addresses.length === 0),
        isUpdating: addresses && addresses.length === 0,
      },
    });
  }, [addresses]);

  const handleCancelClick = (e, addressType) => {
    e.preventDefault();
    setAddressStatus((prev) => ({
      ...prev,
      [addressType]: { ...prev[addressType], isUpdating: false },
    }));
  };

  const handleEditClick = (e, addressType) => {
    e.preventDefault();
    setAddressStatus((prev) => ({
      ...prev,
      [addressType]: { ...prev[addressType], isUpdating: true },
    }));
  };

  const handleSaveClick = async (e, addressType) => {
    e.preventDefault();

    try {
      const getAddressData = (address) => ({
        id: address.id,
        title: addressStatus[addressType]?.isCreatable ? "Home" : address.title,
        name: address.name,
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2,
        division_id: parseInt(address?.division?.id),
        district_id: parseInt(address?.district?.id),
        upazila_id: parseInt(address?.upazila?.id),
        postcode: address.postcode,
        phone: address.phone,
        email: address.email,
        is_default_billing: addressStatus[addressType]?.isCreatable
          ? "1"
          : null,
        is_default_shipping: addressStatus[addressType]?.isCreatable
          ? "1"
          : null,
      });

      let data;

      if (addressType === "billing") {
        data = getAddressData(billingAddress);
      } else {
        data = getAddressData(shippingAddress);
      }

      if (addressStatus[addressType].isEditable) {
        const response = await editAddress(data);

        if (response?.status) {
          setAddressStatus((prev) => ({
            ...prev,
            [addressType]: {
              isCreatable: false,
              isEditable: true,
              isUpdating: false,
            },
          }));

          setCoupon((prev) => ({
            ...prev,
            code: "",
            appliedCode: "",
            isChecking: false,
            isApplied: false,
            discount: cart?.discount || 0,
            shipping_charge: totalShippingCharge,
          }));

          tostify(toast, "success", {
            message: "Address updated successfully",
          });

          const response = await fetchAddresses();
          if (response?.data) {
            setAddresses(response.data);
          }
        }
      } else if (addressStatus[addressType].isCreatable) {
        const response = await saveAddress(data);
        // console.log(response);
        // return;
        if (response?.status) {
          // Display success toast if saveAddress is successful
          setAddressStatus((prev) => ({
            ...prev,
            [addressType]: {
              isCreatable: false,
              isEditable: true,
              isUpdating: false,
            },
          }));

          setCoupon((prev) => ({
            ...prev,
            code: "",
            appliedCode: "",
            isChecking: false,
            isApplied: false,
            discount: cart?.discount || 0,
            shipping_charge: totalShippingCharge,
          }));

          tostify(toast, "success", {
            message: "Address created successfully",
          });

          const response = await fetchAddresses();
          if (response?.data) {
            // console.log(response?.data);
            setAddresses(response.data);
            setBillingAddress(response?.data[0]);
            setShippingAddress(response?.data[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
      tostify(toast, "error", { message: error.message });
    }
  };

  const hasFreeShipping = discount?.some(item => item.shippingCharge === 0);
  const totalDiscount = discount.reduce((total, item) => total + item.discountAmount, 0);

  return (
    <Fragment>
      <Head>
        <title>{makeTitle("Checkout")}</title>
      </Head>
      <section>
        <div className="position-relative mn">
          <Image src={Payment} alt="" className="img-fluid payment" />
          <h1 className="pay-banner-text text-light text-uppercase font-48 fw-bold">
            payment
          </h1>
        </div>
        <Container>
          <Row>
            <Col lg={7} md={12} sm={12} className=" mt-4">
              <div className="row">
                <div className="col-8">
                  <h1 className="text-uppercase font-24 fw-bold mb-3 billing_details">
                    BILLING DETAILS
                  </h1>
                </div>
                <div className="col-4 text-end">
                  <div className="text-end">
                    <select
                      className="form-select"
                      value={billingAddress?.id}
                      onChange={(event) =>
                        handleSetDefaultBillingAddress(
                          event,
                          event.target.value
                        )
                      }
                    >
                      <option value="">Set Default Billing</option>
                      {addresses &&
                        addresses.length > 0 &&
                        addresses.map((address, key) => (
                          <option key={key} value={address.id}>
                            {address.title}
                          </option>
                        ))}
                    </select>
                    <Link
                      href="/my-account?tab=address"
                      className="btn btn-primary m-0 text-capitalize cursor-pointer font-14 mt-2"
                    >
                      Add New
                    </Link>
                  </div>
                </div>
              </div>
              <Row>
                <Col lg={12} md={12} className="">
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      className="rounded-0 form-deco"
                      value={billingAddress?.name || ""}
                      readOnly={!addressStatus?.billing?.isUpdating}
                      onChange={(e) =>
                        setBillingAddress((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} className="">
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      className="rounded-0 form-deco"
                      value={billingAddress?.address_line_1 || ""}
                      readOnly={!addressStatus?.billing?.isUpdating}
                      onChange={(e) =>
                        setBillingAddress((prev) => ({
                          ...prev,
                          address_line_1: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col lg={6} md={6} className="">
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      className="rounded-0 form-deco"
                      value={billingAddress?.address_line_2 || ""}
                      readOnly={!addressStatus?.billing?.isUpdating}
                      onChange={(e) =>
                        setBillingAddress((prev) => ({
                          ...prev,
                          address_line_2: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} className="">
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>Division</Form.Label>

                    <Form.Select
                      className="rounded-0 form-deco form-control"
                      aria-label="Default select example"
                      onChange={(e) => {
                        const selectedDivisionId = e.target.value;
                        const selectedDivision = divisions.find(
                          (item) => item.id === parseInt(selectedDivisionId)
                        );

                        handleDivisionBillingChange(e, selectedDivision);
                      }}
                      value={billingAddress?.division?.id || ""}
                      disabled={!addressStatus?.billing?.isUpdating}
                    >
                      <option>Select division</option>
                      {divisions &&
                        divisions.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item?.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} className="">
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>District</Form.Label>
                    <Form.Select
                      className="rounded-0 form-deco form-control"
                      aria-label="Default select example"
                      onChange={(e) => {
                        const selectedDistrictId = e.target.value;
                        const selectedDistrict = districtsBilling.find(
                          (item) => item.id === parseInt(selectedDistrictId)
                        );
                        handleDistrictBillingChange(e, selectedDistrict);
                      }}
                      value={billingAddress?.district?.id || ""}
                      disabled={!addressStatus?.billing?.isUpdating}
                    >
                      <option>Select district</option>
                      {districtsBilling &&
                        districtsBilling.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item?.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} className="">
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>Upazila</Form.Label>
                    <Form.Select
                      className="rounded-0 form-deco form-control"
                      aria-label="Default select example"
                      onChange={(e) => {
                        const selectedUpazilaId = e.target.value;
                        const selectedUpazila = upazilasBilling.find(
                          (item) => item.id === parseInt(selectedUpazilaId)
                        );
                        handleUpazilaBillingChange(e, selectedUpazila);
                      }}
                      value={billingAddress?.upazila?.id || ""}
                      disabled={!addressStatus?.billing?.isUpdating}
                    >
                      <option>Select upazila</option>
                      {upazilasBilling &&
                        upazilasBilling.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item?.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} className="">
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>Postcode</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      className="rounded-0 form-deco"
                      value={billingAddress?.postcode || ""}
                      readOnly={!addressStatus?.billing?.isUpdating}
                      onChange={(e) =>
                        setBillingAddress((prev) => ({
                          ...prev,
                          postcode: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} className="">
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      className="rounded-0 form-deco"
                      value={billingAddress?.phone || ""}
                      readOnly={!addressStatus?.billing?.isUpdating}
                      onChange={(e) =>
                        setBillingAddress((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col lg={4} md={4} className="">
                  <Form.Group className="mb-3" controlId="">
                    <Form.Label className="font-lato">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder=""
                      className="rounded-0 form-deco"
                      value={billingAddress?.email || ""}
                      readOnly={!addressStatus?.billing?.isUpdating}
                      onChange={(e) =>
                        setBillingAddress((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>
                </Col>

                <Col
                  lg={12}
                  md={12}
                  className="d-flex justify-end col-4 text-end"
                >
                  {addressStatus?.billing?.isUpdating ? (
                    <div className="text-end d-flex align-items-center">
                      <button
                        className="btn btn-secondary m-0 d-flex align-items-center justify-content-center text-capitalize cursor-pointer font-14 mt-2"
                        onClick={(e) => handleCancelClick(e, "billing")}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn place_order_border m-0 d-flex align-items-center justify-content-center text-capitalize cursor-pointer font-14 mt-2 theme-text ms-2"
                        onClick={(e) => handleSaveClick(e, "billing")}
                      >
                        {addressStatus?.billing?.isCreatable
                          ? "Create"
                          : "Save"}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn place_order_border m-0 d-flex align-items-center justify-content-center text-capitalize cursor-pointer font-14 mt-2 theme-text"
                      onClick={(e) => handleEditClick(e, "billing")}
                    >
                      {addressStatus?.billing?.isCreatable
                        ? "Create"
                        : addressStatus?.billing?.isEditable
                        ? "Edit"
                        : ""}
                    </button>
                  )}
                </Col>
              </Row>

              <br />
              <br />
              <div className="row">
                <div className="col-8">
                  <h1 className="text-uppercase font-24 fw-bold mb-3">
                    SHIPPING DETAILS
                  </h1>
                  <div className="col-lg-12 d-flex justify-content-start align-items-center mb-3">
                    <div className="form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={(e) => handleShippingSameAsBilling(e)}
                        checked={isShippingSameAsBilling}
                        role="switch"
                        id="permanentSameAsPresent"
                      />
                    </div>
                    <span>Same as billing address</span>
                  </div>
                </div>
                {!isShippingSameAsBilling && (
                  <div className="col-4 text-end">
                    <select
                      className="form-select"
                      value={shippingAddress?.id}
                      onChange={(event) =>
                        handleSetDefaultShippingAddress(
                          event,
                          event.target.value
                        )
                      }
                      disabled={isShippingSameAsBilling}
                    >
                      <option value="">Set Default Shipping</option>
                      {addresses &&
                        addresses.length > 0 &&
                        addresses.map((address, key) => (
                          <option key={key} value={address.id}>
                            {address.title}
                          </option>
                        ))}
                    </select>
                    <Link
                      href="/my-account?tab=address"
                      className="btn btn-link m-0 p-0"
                    >
                      Add New
                    </Link>
                  </div>
                )}
              </div>
              {!isShippingSameAsBilling && (
                <Row>
                  <Col lg={12} md={12} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        className="rounded-0 form-deco"
                        value={shippingAddress?.name || ""}
                        readOnly={!addressStatus?.shipping?.isUpdating}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={6} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>Address Line 1</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        className="rounded-0 form-deco"
                        value={shippingAddress?.address_line_1 || ""}
                        readOnly={!addressStatus?.shipping?.isUpdating}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            address_line_1: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6} md={6} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>Address Line 2</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        className="rounded-0 form-deco"
                        value={shippingAddress?.address_line_2 || ""}
                        readOnly={!addressStatus?.shipping?.isUpdating}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            address_line_2: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>

                  {/* <Col lg={4} md={4} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>Division</Form.Label>

                      <Form.Select
                        className="rounded-0 form-deco form-control"
                        aria-label="Default select example"
                        onChange={(e) => handleDivisionShippingChange(e)}
                        value={selectedDivisionShipping}
                        disabled={isShippingSameAsBilling}
                      >
                        <option>Select division</option>
                        {divisions &&
                          divisions.map((item) => (
                            <option value={item.id}>{item?.name}</option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>District</Form.Label>

                      <Form.Select
                        className="rounded-0 form-deco form-control"
                        aria-label="Default select example"
                        onChange={(e) => handleDistrictShippingChange(e)}
                        value={selectedDistrictShipping}
                        disabled={isShippingSameAsBilling}
                      >
                        <option>Select district</option>
                        {districtsShipping &&
                          districtsShipping.map((item) => (
                            <option value={item?.id}>{item?.name}</option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>Upazila</Form.Label>
                      <Form.Select
                        className="rounded-0 form-deco form-control"
                        aria-label="Default select example"
                        onChange={(e) => handleUpazilaShippingChange(e)}
                        value={selectedUpazilaShipping}
                        disabled={isShippingSameAsBilling}
                      >
                        <option>Select upazila</option>
                        {upazilasShipping &&
                          upazilasShipping.map((item) => (
                            <option value={item?.id}>{item?.name}</option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col> */}

                  <Col lg={4} md={4} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>Division</Form.Label>

                      <Form.Select
                        className="rounded-0 form-deco form-control"
                        aria-label="Default select example"
                        onChange={(e) => {
                          const selectedDivisionId = e.target.value;
                          const selectedDivision = divisions.find(
                            (item) => item.id === parseInt(selectedDivisionId)
                          );

                          handleDivisionShippingChange(e, selectedDivision);
                        }}
                        value={shippingAddress?.division?.id || ""}
                        disabled={!addressStatus?.shipping?.isUpdating}
                      >
                        <option>Select division</option>
                        {divisions &&
                          divisions.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item?.name}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>District</Form.Label>
                      <Form.Select
                        className="rounded-0 form-deco form-control"
                        aria-label="Default select example"
                        onChange={(e) => {
                          const selectedDistrictId = e.target.value;
                          const selectedDistrict = districtsShipping.find(
                            (item) => item.id === parseInt(selectedDistrictId)
                          );
                          handleDistrictShippingChange(e, selectedDistrict);
                        }}
                        value={shippingAddress?.district?.id || ""}
                        disabled={!addressStatus?.shipping?.isUpdating}
                      >
                        <option>Select district</option>
                        {districtsShipping &&
                          districtsShipping.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item?.name}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>Upazila</Form.Label>
                      <Form.Select
                        className="rounded-0 form-deco form-control"
                        aria-label="Default select example"
                        onChange={(e) => {
                          const selectedUpazilaId = e.target.value;
                          const selectedUpazila = upazilasShipping.find(
                            (item) => item.id === parseInt(selectedUpazilaId)
                          );
                          handleUpazilaShippingChange(e, selectedUpazila);
                        }}
                        value={shippingAddress?.upazila?.id || ""}
                        disabled={!addressStatus?.shipping?.isUpdating}
                      >
                        <option>Select upazila</option>
                        {upazilasShipping &&
                          upazilasShipping.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item?.name}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col lg={4} md={4} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>Postcode</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        className="rounded-0 form-deco"
                        value={shippingAddress?.postcode || ""}
                        readOnly={!addressStatus?.shipping?.isUpdating}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            postcode: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder=""
                        className="rounded-0 form-deco"
                        value={shippingAddress?.phone || ""}
                        readOnly={!addressStatus?.shipping?.isUpdating}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={4} className="">
                    <Form.Group className="mb-3" controlId="">
                      <Form.Label className="font-lato">
                        Email Address
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder=""
                        className="rounded-0 form-deco"
                        value={shippingAddress?.email || ""}
                        readOnly={!addressStatus?.shipping?.isUpdating}
                        onChange={(e) =>
                          setShippingAddress((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col
                    lg={12}
                    md={12}
                    className="d-flex justify-end col-4 text-end"
                  >
                    {addressStatus?.shipping?.isUpdating ? (
                      <div className="text-end d-flex align-items-center">
                        <button
                          className="btn btn-secondary m-0 d-flex align-items-center justify-content-center text-capitalize cursor-pointer font-14 mt-2"
                          onClick={(e) => handleCancelClick(e, "shipping")}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn place_order_border m-0 d-flex align-items-center justify-content-center text-capitalize cursor-pointer font-14 mt-2 theme-text ms-2"
                          onClick={(e) => handleSaveClick(e, "shipping")}
                        >
                          {addressStatus?.shipping?.isCreatable
                            ? "Create"
                            : "Save"}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn place_order_border m-0 d-flex align-items-center justify-content-center text-capitalize cursor-pointer font-14 mt-2 theme-text"
                        onClick={(e) => handleEditClick(e, "shipping")}
                      >
                        {addressStatus?.shipping?.isCreatable
                          ? "Create"
                          : addressStatus?.shipping?.isEditable
                          ? "Edit"
                          : ""}
                      </button>
                    )}
                  </Col>
                </Row>
              )}

              <br />
              <br />
              <h1 className="text-uppercase font-24 fw-bold mb-3">NOTE</h1>
              <textarea
                className="form-control form-deco"
                rows={5}
                placeholder="Write some note here.."
              />
              <br />
              <br />
            </Col>
            <Col lg={5} md={12} sm={12} className=" my-4">
              <div className="payment-card p-3">
                <h2 className="text-uppercase font-24 fw-bold ps-2">
                  your order
                </h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Product</th>
                      <th scope="col" className="text-end">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart?.items &&
                      cart.items.length > 0 &&
                      cart.items.map((item, key) => (
                        <tr key={key}>
                          <th
                            scope="row"
                            className="fw-normal text-wrap lh-base text-capitalize font-16 "
                          >
                            {item.type === "product" && (
                              <a href={`/product/${item.inventory_id}`}>
                                {item.title}
                              </a>
                            )}
                            {item.type === "combo" && (
                              <a href={`/combo/pack/${item.combo_id}`}>
                                {item.title}
                              </a>
                            )}
                          </th>
                          <td className="text-end">
                            {item.quantity}
                            &nbsp;x &nbsp;{item.unit_price}
                            &nbsp;= &nbsp;{item.total} Tk
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="">
                  <div className="d-flex justify-content-between">
                    <p className="font-lato text-capitalize font-20 pe-2 phone_res">
                      subtotal:{" "}
                    </p>
                    <p className=" font-20 phone_res ">{cart.subTotal} Tk</p>
                  </div>

                  {coupon?.isApplied ? (
                    <div className="d-flex justify-content-between">
                      <p className="font-lato text-capitalize font-20 pe-2 phone_res d-flex justify-content-start align-items-center">
                        Discount ({coupon?.appliedCode}) (
                        <span
                          className="remove-coupon"
                          onClick={handleRemoveCoupon}
                        >
                          {/* <svg
                            width='23'
                            height='22'
                            viewBox='0 0 23 22'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                            className='close-icon'
                          >
                            <path d='M5.48881 15.5962L16.0954 4.98963L17.5096 6.40384L6.90302 17.0104L5.48881 15.5962Z' fill='%23000'/>
                            <path d='M16.0954 17.7176L4.7817 6.40384L6.19592 4.98963L17.5096 16.3033L16.0954 17.7176Z' fill='%23000'/>
                          </svg> */}
                          Remove
                        </span>
                        ):
                      </p>
                      <p className=" font-20 phone_res ">
                        {coupon?.discount} Tk
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  {coupon?.shipping_charge ? (
                    <div className="d-flex justify-content-between">
                      <p className="font-lato text-capitalize font-20 pe-2 phone_res">
                        shipping charge ({totalWeight.toFixed(2)} kg):{" "}
                      </p>
                      <p className=" font-20  phone_res">
                        {hasFreeShipping ? 0 : coupon?.shipping_charge} Tk
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  {discount?.length ? discount.map(d => {
                     return !(d?.shippingCharge === 0) ? (
                      <div className="d-flex justify-content-between">
                      <p className="font-lato text-capitalize font-20 pe-2 phone_res">
                        Discount ({d.discountDescription}):
                      </p>
                      <p className=" font-20  phone_res">
                        {d?.discountAmount} Tk
                      </p>
                    </div>
                    ) : ""
                  }) : ""}

                  <div className="d-flex justify-content-between">
                    <p className="font-lato text-capitalize font-20 pe-2 phone_res theme-text">
                      total:{" "}
                    </p>
                    <p className="font-20 theme-text phone_res">
                      {cart.subTotal + (hasFreeShipping ? 0 : coupon?.shipping_charge || 0) - (coupon?.discount + totalDiscount || 0)}{" "}Tk
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  {paymentMethods &&
                    paymentMethods.length > 0 &&
                    paymentMethods.map((paymentMethod, key) => (
                      <div className="form-check form-check-inline" key={key}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          value={paymentMethod.id}
                          onChange={(event) =>
                            handlePaymentMethodId(event.target.value)
                          }
                        />
                        <label
                          className="form-check-label text-capitalize"
                          htmlFor="inlineRadio1"
                        >
                          {paymentMethod.code === "sslcommerze"
                            ? "Pay Online"
                            : "COD"}
                        </label>
                      </div>
                    ))}
                </div>

                <p className="mt-3 d-flex flex-column">
                  <span>
                    <strong>Delivery:</strong> Inside Dhaka in 24 hours, outside
                    Dhaka in 48 hours
                  </span>
                </p>
                {/* <p className="mt-2 d-flex flex-column">
                    <span>Outside Dhaka in 48 hours</span>
                  </p> */}

                <div className="mt-3 d-flex">
                  <Form.Group
                    className="mb-1 text-secondary d-flex me-2 justify-content-start"
                    controlId=""
                  >
                    <Form.Check
                      type="checkbox"
                      label=""
                      onChange={(event) => setAgree(event.target.checked)}
                      className="me-2"
                    />
                    <Link href="/terms-and-conditions" className="mr-1">
                      Terms & Conditions,
                    </Link>
                    <Link href="/refund-policy" className="mr-1">
                      Refund policy,
                    </Link>
                    <Link href="/privacy-policy" className="mr-1">
                      Privacy policy
                    </Link>
                  </Form.Group>
                </div>

                <div className="coupon mb-4 mt-4">
                  <label className="mb-2" htmlFor="coupon">
                    Have a coupon?
                  </label>
                  <div className="coupon_input">
                    <input
                      id="coupon"
                      type="search"
                      name="coupon"
                      placeholder="Enter coupon code"
                      value={coupon?.code}
                      onChange={(e) =>
                        setCoupon((prev) => ({
                          ...prev,
                          code: e.target.value,
                        }))
                      }
                      disabled={coupon?.isChecking}
                    />
                    <button
                      type="button"
                      // className="d-flex align-items-center justify-content-center text-capitalize place_order_border cursor-pointer font-16 w-100 place-order mt-4 font-lato fw-bold theme-text"
                      onClick={(e) => handleSendCoupon(e)}
                      disabled={coupon?.isChecking}
                    >
                      {coupon?.isChecking && (
                        <span className="me-2">
                          <Oval
                            height={18}
                            width={18}
                            color="#f38120"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                            ariaLabel="oval-loading"
                            secondaryColor="#f38120"
                            strokeWidth={6}
                            strokeWidthSecondary={6}
                          />
                        </span>
                      )}{" "}
                      Apply
                    </button>
                  </div>
                </div>

                <div className="">
                  <button
                    type="button"
                    className="d-flex align-items-center justify-content-center text-capitalize place_order_border cursor-pointer font-16 w-100 place-order mt-4 font-lato fw-bold theme-text"
                    onClick={(event) => handlePlaceOrder(event)}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <span className="me-2">
                        <Oval
                          height={18}
                          width={18}
                          color="#ffffff"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible={true}
                          ariaLabel="oval-loading"
                          secondaryColor="#ffffff"
                          strokeWidth={6}
                          strokeWidthSecondary={6}
                        />
                      </span>
                    )}{" "}
                    place order
                  </button>
                </div>
              </div>

              <div className="">
                <p className="text-capitalize py-3 font-16">
                  online payment by SSLCommerz:
                </p>
                <div className="row">
                  <Col lg={4} md={4} sm={4} className="mb-3">
                    <p className="text-capitalize text-center pb-2">card</p>
                    <Image
                      src={Card}
                      alt="card"
                      className=" card-payment rounded-1 shadow"
                    />
                  </Col>
                  <Col lg={4} md={4} sm={4} className="mb-3">
                    <p className="text-capitalize text-center pb-2">
                      bank transfer
                    </p>
                    <Image
                      src={BankTransfer}
                      alt="card"
                      className=" transfer-payment rounded-1 shadow"
                    />
                  </Col>
                  <Col lg={4} md={4} sm={4} className="mb-3">
                    <p className="text-capitalize text-center pb-2">
                      mobile banking
                    </p>
                    <Image
                      src={Mobile}
                      alt="card"
                      className=" card-payment rounded-1 shadow"
                    />
                  </Col>
                </div>
              </div>

              <div className="">
                <p className="text-capitalize py-3 font-16 fw-bold">
                  Company Information:
                </p>
                <div className="row">
                  <Col lg={12} md={12} className="d-flex">
                    <b className="text-capitalize text-center pb-2 mr-1">
                      TIN:
                    </b>
                    <p className="text-capitalize text-center pb-2">
                      117029919179
                    </p>
                  </Col>
                  <Col lg={12} md={12} className="d-flex">
                    <b className="text-capitalize text-center pb-2 mr-1">
                      BIN:
                    </b>
                    <p className="text-capitalize text-center pb-2">
                      000079132-0403
                    </p>
                  </Col>
                  <Col lg={12} md={12} className="d-flex">
                    <b className="text-capitalize text-center pb-2 mr-1">
                      Trade License:
                    </b>
                    <p className="text-capitalize text-center pb-2">
                      TRAD/DESCC/216136/2019
                    </p>
                  </Col>
                </div>
              </div>

              <div className="">
                <p className="text-capitalize py-3 font-16 fw-bold">
                  Bank Account Info:
                </p>
                <div className="row">
                  <Col lg={12} md={12} className="d-flex">
                    <b className="text-capitalize text-center pb-2 mr-1">
                      Acc Name:
                    </b>
                    <p className="text-capitalize text-center pb-2">
                      Ifad Multi Products Limited
                    </p>
                  </Col>
                  <Col lg={12} md={12} className="d-flex">
                    <b className="text-capitalize text-center pb-2 mr-1">
                      Acc No:
                    </b>
                    <p className="text-capitalize text-center pb-2">
                      00233011222
                    </p>
                  </Col>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <ScrollToTopButton />
    </Fragment>
  );
};

export default withAuth(CheckoutPage);
