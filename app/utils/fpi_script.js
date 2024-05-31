/* eslint camelcase: "off" */

const consumeEvent = () => {
  const GA_FPI_EVENTS = {
    // USER
    LOG_IN: 'user.login',
    LOG_OUT: 'user.logout',
    // USER
    PROFILE_UPDATE: 'user.update',
    // PLP
    PRODUCT_LIST_VIEW: 'product_list.view',
    COLLECTION_LIST_VIEW: 'collection_list.view',
    PRODUCT_LIST_CLICK: 'product_list.click',
    PRODUCT_FILTER: 'product_list.filter',
    PRODUCT_SORT: 'product_list.sort',
    // PDP
    PRODUCT_DETAIL_PAGE_VIEW: 'product.view',
    NOTIFY_PRODUCT: 'notify.product',
    ADD_TO_COMPARE: 'compare.add',
    REMOVE_FROM_COMPARE: 'compare.remove',
    ADD_TO_WISHLIST: 'wishlist.add',
    REMOVE_FROM_WISHLIST: 'wishlist.remove',
    // CART
    VIEW_CART: 'cart.view',
    ADD_TO_CART: 'cart.newProduct',
    REMOVE_FROM_CART: 'cart.remove',
    UPDATE_CART: 'cart.update',
    // ORDER
    ORDER_CHECKOUT: 'order.checkout',
    ADD_PAYMENT_INFORMATION: 'order.payment_information',
    ADD_ADDRESS_INFORMATION: 'order.address_information',
    ORDER_PROCESSED: 'order.processed',
    ORDER_TRACKING_VIEW: 'order_tracking.view',
    // REFUND
    REFUND_SUCCESS: 'refund.success',
    // SEARCH
    SEARCH_PRODUCTS: 'search.products',
    PINCODE_SERVICEABILITY: 'pincode.serviceablility',
  };

  const getGAEventName = event => {
    const GA_EVENTS = {
      [GA_FPI_EVENTS.PRODUCT_DETAIL_PAGE_VIEW]: 'view_item',
      [GA_FPI_EVENTS.ADD_TO_CART]: 'add_to_cart',
      [GA_FPI_EVENTS.REMOVE_FROM_CART]: 'remove_from_cart',
      [GA_FPI_EVENTS.ORDER_CHECKOUT]: 'begin_checkout',
      [GA_FPI_EVENTS.ORDER_PROCESSED]: 'purchase',
      [GA_FPI_EVENTS.REFUND_SUCCESS]: 'refund',
      [GA_FPI_EVENTS.PRODUCT_LIST_VIEW]: 'view_item_list',
      [GA_FPI_EVENTS.COLLECTION_LIST_VIEW]: 'view_collection',
      [GA_FPI_EVENTS.ADD_TO_WISHLIST]: 'add_to_wishlist',
      [GA_FPI_EVENTS.VIEW_CART]: 'view_cart',
      [GA_FPI_EVENTS.SEARCH_PRODUCTS]: 'products_searched',
      [GA_FPI_EVENTS.ADD_PAYMENT_INFORMATION]: 'add_payment_info',
      [GA_FPI_EVENTS.ADD_ADDRESS_INFORMATION]: 'add_shipping_info',
      [GA_FPI_EVENTS.LOG_IN]: 'login',
      [GA_FPI_EVENTS.LOG_OUT]: 'logout',
      [GA_FPI_EVENTS.PROFILE_UPDATE]: 'profile_update',
    };
    return GA_EVENTS[event] || 'not_known';
  };
  const transformDataForGA = (event, eventData) => {
    let payload = {};
    switch (event) {
      case GA_FPI_EVENTS.SEARCH_PRODUCTS: {
        const { search_text } = eventData;
        payload = {
          query: search_text,
        };
        break;
      }
      case GA_FPI_EVENTS.LOG_IN: {
        const { user_id, login_value, method, gender, phone_number, email } =
          eventData;
        payload = {
          user_id,
          login_value,
          method,
          gender,
          email,
          phone_number,
        };
        break;
      }
      case GA_FPI_EVENTS.LOG_OUT: {
        const { user_id, phone, email } = eventData;
        payload = {
          user_id,
          phone,
          email,
        };
        break;
      }
      case GA_FPI_EVENTS.PROFILE_UPDATE: {
        const { gender, email, phone_number, user_id } = eventData;
        payload = {
          user_id,
          gender,
          email,
          phone_number,
        };
        break;
      }
      case GA_FPI_EVENTS.ADD_TO_WISHLIST: {
        const { item } = eventData;
        let item_category = '';
        if (item.categories && item.categories.length) {
          item_category = item.categories[0].name;
        }
        payload.items = [
          {
            item_id: item.uid,
            item_name: item.name,
            currency: 'INR',
            discount: item.discount,
            item_brand: item.brand ? item.brand.name : '',
            item_category,
            price: item.price ? item.price.effective.max : '',
            quantity: 1,
          },
        ];
        break;
      }
      case GA_FPI_EVENTS.REMOVE_FROM_WISHLIST: {
        const { item } = eventData;
        let item_category = '';
        if (item.categories && item.categories.length) {
          item_category = item.categories[0].name;
        }
        payload.items = [
          {
            item_id: item.uid,
            item_name: item.name,
            currency: 'INR',
            discount: item.discount,
            item_brand: item.brand.name,
            item_category,
            price: item.price && item.price.effective.max,
            quantity: 1,
          },
        ];
        break;
      }
      case GA_FPI_EVENTS.PRODUCT_DETAIL_PAGE_VIEW: {
        const { product } = eventData;
        payload.items = [
          {
            item_name: product.name,
            item_id: product.uid,
            item_brand: product.brand.name,
            item_category: product.category.name,
            price: product.price.max,
            quantity: 1,
            currency: 'INR',
          },
        ];
        break;
      }
      case GA_FPI_EVENTS.PRODUCT_LIST_VIEW: {
        const { items } = eventData;
        const itemsOfListing = [];
        items.forEach(item => {
          let item_category = '';
          if (item.categories && item.categories.length) {
            item_category = item.categories[0].name;
          }
          const objectToBePushed = {
            item_id: item.item_code ? item.item_code : '',
            item_name: item.name ? item.name : '',
            currency: 'INR',
            discount: item.discount ? item.discount : '',
            item_brand: item.brand.name ? item.brand.name : '',
            price: item.price.effective.max ? item.price.effective.max : '',
            quantity: 1,
            item_list_name: eventData.name || 'Product Listing',
            item_list_id: eventData.slug || eventData.url || 'listing_page',
            item_uid: item.uid ? item.uid : '',
            item_category,
          };
          itemsOfListing.push(objectToBePushed);
        });
        payload.item_list_name = eventData.name || 'Product Listing';
        payload.item_list_id =
          eventData.slug || eventData.url || 'listing_page';
        payload.items = itemsOfListing;
        break;
      }
      case GA_FPI_EVENTS.COLLECTION_LIST_VIEW: {
        payload.items = [
          {
            item_list_name: eventData.name || 'Product Listing',
            item_list_id: eventData.slug || eventData.url || 'listing_page',
          },
        ];
        break;
      }
      case GA_FPI_EVENTS.ADD_TO_CART: {
        const { cart_id, products } = eventData;
        const itemsToBePushed = [];
        products.forEach(product =>
          itemsToBePushed.push({
            item_id: product.uid,
            item_name: product.name,
            currency: 'INR',
            item_brand: product.brand.name,
            price: product.price.effective,
            quantity: product.quantity.current,
            item_category: product.category.name,
          })
        );
        payload.items = itemsToBePushed;
        payload.cart_id = cart_id;
        break;
      }
      case GA_FPI_EVENTS.ORDER_CHECKOUT: {
        const { products, cart_id, breakup_values } = eventData;
        const itemsOfBag = [];
        products.forEach(product => {
          const objectToBePushed = {
            item_id: product.uid,
            item_name: product.name,
            currency: 'INR',
            discount: product.discount,
            item_brand: product.brand.name,
            price: product.price ? product.price.effective : '',
            quantity: product.quantity.current,
            item_category: product.category.name,
          };
          itemsOfBag.push(objectToBePushed);
        });
        payload.value = breakup_values.raw.subtotal;
        payload.cart_id = cart_id;
        payload.items = itemsOfBag;
        payload.coupon = breakup_values.raw.coupon;
        payload.coupon_code = breakup_values.coupon.code;
        payload.shipping = breakup_values.raw.delivery_charge;
        payload.discount = breakup_values.raw.discount;
        payload.currency = 'INR';
        break;
      }
      case GA_FPI_EVENTS.ADD_PAYMENT_INFORMATION: {
        const payment_information = eventData;
        payload.currency = 'INR';
        payload.value = payment_information.value;
        payload.coupon = payment_information.coupon.coupon_code;
        payload.payment_type = payment_information.payment.payment_type;
        payload.shipping = payment_information.delivery_charges;
        payload.cart_id = payment_information.cart.cart_id;
        break;
      }
      case GA_FPI_EVENTS.ADD_ADDRESS_INFORMATION: {
        const payment_information = eventData;
        payload.currency = 'INR';
        payload.value = payment_information.value;
        payload.coupon = payment_information.coupon.coupon_code;
        payload.pincode = payment_information.pincode;
        payload.cart_id = payment_information.cart.cart_id;
        break;
      }
      case GA_FPI_EVENTS.REMOVE_FROM_CART: {
        const { cart_id, products } = eventData;
        const itemsToBePushed = [];
        products.forEach(product =>
          itemsToBePushed.push({
            item_id: product.uid,
            item_name: product.name,
            currency: 'INR',
            discount: product.discount,
            item_brand: product.brand.name,
            price: product.price ? product.price.effective : '',
            quantity: product.quantity.current,
            item_category: product.category.name,
          })
        );
        payload.items = itemsToBePushed;
        payload.cart_id = cart_id;
        break;
      }
      case GA_FPI_EVENTS.VIEW_CART: {
        const { cart_id, products, breakup_values_raw } = eventData;
        payload.cart_id = cart_id;
        const itemsToBePushed = [];
        products.forEach(product => {
          const objectToBePushed = {
            item_id: product.uid,
            item_name: product.name,
            currency: 'INR',
            discount: product.discount,
            item_brand: product.brand.name,
            price: product.price ? product.price.effective : '',
            quantity: product.quantity.current,
            item_category: product.category.name,
          };
          itemsToBePushed.push(objectToBePushed);
        });
        payload.currency = 'INR';
        payload.value = breakup_values_raw.subtotal;
        payload.items = itemsToBePushed;
        break;
      }
      case GA_FPI_EVENTS.UPDATE_CART: {
        const { cart_id, products, operation } = eventData;
        payload.items = products.map(product => {
          const price = product.price_per_unit.converted.effective;
          const quantity = product.quantity.current;
          return {
            item_name: product.name,
            item_id: product.uid,
            item_brand: product.brand.name,
            item_category: product.category.name,
            // eslint-disable-next-line no-restricted-globals
            price: !isNaN(price * quantity)
              ? (price * quantity).toFixed(2)
              : '',
            quantity: product.quantity.current,
            currency: 'INR',
          };
        });
        payload.cart_id = cart_id;

        if (operation === 'increment_quantity') {
          payload.event_action = GA_FPI_EVENTS.ADD_TO_CART;
        } else if (operation === 'decrement_quantity') {
          payload.event_action = GA_FPI_EVENTS.REMOVE_FROM_CART;
        } else {
          payload.event_action = event;
        }
        break;
      }
      case GA_FPI_EVENTS.ORDER_PROCESSED: {
        const order_data = eventData;
        payload.transaction_id = order_data.order_id;
        payload.value = order_data.breakup_values_raw.total;
        payload.shipping = order_data.breakup_values_raw.delivery_charges;
        payload.currency = 'INR';
        payload.coupon = order_data.breakup_values_raw.coupon;
        payload.items = order_data.items.map(product => ({
          item_name: product.name,
          item_id: product.id,
          item_brand: product.brand.name,
        }));
        break;
      }
      case GA_FPI_EVENTS.REFUND_SUCCESS: {
        const { refund_data } = eventData;
        const { shipments } = refund_data.statuses[0];
        const [firstKey] = Object.keys(shipments);
        payload.transaction_id = firstKey;
        break;
      }
      default:
        payload = eventData;
    }
    return payload;
  };

  const pushToDataLayerGA = (passedEvent, eventData) => {
    const payload = transformDataForGA(passedEvent, eventData);
    let event = payload.event_action ? payload.event_action : passedEvent;
    event = getGAEventName(event);
    if (event === 'not_known') return;
    if (typeof window !== 'undefined') {
      payload.userAgent = window.navigator.userAgent;
    }
    gtag('event', event, payload);
  };
  if (FPI) {
    Object.keys(GA_FPI_EVENTS).forEach(event => {
      FPI.event.on(GA_FPI_EVENTS[event], eventData => {
        console.log(`FPI GA4 ${event}`);
        pushToDataLayerGA(GA_FPI_EVENTS[event], eventData);
      });
    });
  }
};
module.exports = consumeEvent;
