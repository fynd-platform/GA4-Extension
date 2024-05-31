<template>
  <div class="docs-container">
    <div class="docs-container">
      <div class="docs-content">
        <div
          v-for="(nav, index) in navigation"
          :id="nav.link"
          :key="index"
          class="content-block"
        >
          <div class="content-title">
            <a :href="`#${nav.link}`" class="content-link">#</a>
            {{ nav.display }}
          </div>
          <div class="content-html" v-html="nav.content"></div>
          <template v-if="nav.children">
            <div
              v-for="(subnav, index) in nav.children"
              :id="subnav.link"
              :key="index"
              class="content-block"
            >
              <div class="content-subtitle">
                <a :href="`#${subnav.link}`" class="content-link">#</a>
                {{ subnav.display }}
              </div>
              <div class="content-html" v-html="subnav.content"></div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: 0,
      sections: 0,
      active_navigation: 'introduction',
      navigation: [
        {
          link: 'introduction',
          display: 'Introduction',
          content: `
						<p>
						Google Analytics is one of the most popular analytics tools to track website traffic and collect visitor insights. It can help you to determine top sources of user traffic, gauge the success of your marketing activities and campaigns, track goal completions (such as purchases, and adding products to carts), discover patterns and trends in user engagement and obtain other visitor information such as demographics.
						</p>
					`,
        },
        {
          display: 'Events',
          link: 'events',
          content: `
					<div>
            <p style="font-weight: bold">Default Events</p>
            <ul>
              <li>Page Views</li>
            </ul>
            <p style="font-weight: bold;margin-top: 10px">Enhanced Measurement Events <a style="font-weight: normal" href="https://support.google.com/analytics/answer/9216061?hl=en-IN&utm_id=ad" target="_blank">More Info</a></p>
            <ul>
              <li>
                Scrolls
              </li>
              <li>
                Outbound clicks
              </li>
              <li>
                Site search
              </li>
              <li>
                Video engagement
              </li>
              <li>
                File downloads
              </li>
            </ul>
            <p style="margin-left: 20px">Note: These events are automatically tracked and can get changed in future. Refer <a target="_blank" href="https://support.google.com/analytics/answer/9216061?hl=en-IN&utm_id=ad">GA4 docs</a> for more details</p>
						<p style="font-weight: bold; margin-top: 10px; margin-bottom: 5px">Data Layer Events</p>
            <p>All the data is added to the data layer as per Google Analytics 4 (GA4). Check all the events supported by the extension to understand when the events are triggered.</p>
						These sections will show you how to use the data layer to measure the listed ecommerce activities:
						<ul>
							<li>
								<a href="#product-list-view">
									Product/Item List Views/Impressions
								</a>
							</li>
							<li>
								<a href="#product-detail-view">
									Product/Item Detail Views
								</a>
							</li>
							<li>
								<a href="#update-cart">
									Adds/Removes from Cart
								</a>
							</li>
							<li>
								<a href="#checkouts">
									Checkouts
								</a>
							</li>
							<li>
								<a href="#purchases">
									Purchases
								</a>
							</li>
							<li>
								<a href="#refunds">
									Refunds
								</a>
							</li>
						</ul>

					</div>
					`,
          children: [
            {
              display: 'Product/Item List Views/Impressions',
              link: 'product-list-view',
              content: `
							<div>
							<p>	
								This event triggers on any of the listing pages, for e.g. product listing, category listing, brand listing, and collection listing. The slug of the listing page is passed as an identifier for this event. <span><a href="https://developers.google.com/tag-manager/ecommerce-ga4#measure_productitem_list_viewsimpressions" target="_blank">Click here</a></span>
                 to know more.
							</p>
							<br />
							<p>Note:  We do not pass product items to this event.</p>
							</div>
							`,
            },
            {
              display: 'Product/Item Detail Views',
              link: 'product-detail-view',
              content: `
							<div>
							<p>	
								This event triggers on the product description page. <span><a href="https://developers.google.com/tag-manager/ecommerce-ga4#measure_viewsimpressions_of_productitem_details" target="_blank">Click here</a></span> to know more.
							</p>
							`,
            },
            {
              display: 'Adds/Removes from Cart',
              link: 'update-cart',
              content: `
							<div>
							<p>	
								This event triggers when a product is added or removed from the cart. Since products are added from the product description page, this event triggers at the cart page as well as the product description page. <span><a href="https://developers.google.com/tag-manager/ecommerce-ga4#measure_additions_or_removals_from_a_shopping_cart" target="_blank">Click here</a></span> to know more.
							</p>
							<br />
							</div>
							`,
            },
            {
              display: 'Checkouts',
              link: 'checkouts',
              content: `
							<div>
							<p>	
								This event triggers when a user clicks the checkout button on the cart page. <span><a href="https://developers.google.com/tag-manager/ecommerce-ga4#measure_a_checkout" target="_blank">Click here</a></span> to know more.
							</p>
							</div>
							`,
            },
            {
              display: 'Purchases',
              link: 'purchases',
              content: `
							<div>
							<p>	
								This event triggers when an order is successfully placed. <span><a href="https://developers.google.com/tag-manager/ecommerce-ga4#measure_purchases" target="_blank">Click here</a></span>
							</p> to know more.
							`,
            },
            {
              display: 'Refunds',
              link: 'refunds',
              content: `
							<div>
							<p>	
								This event triggers when a return request for any order is placed successfully. <span><a href="https://developers.google.com/tag-manager/ecommerce-ga4#measure_refunds" target="_blank">Click here</a></span> to know more.
							</p>
							`,
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
:deep(body) {
  background-color: white;
}
.docs-container {
  display: flex;

  .docs-container {
    width: 100%;
    margin-top: 30px;
    scroll-behavior: smooth;
    @media @mobile {
      padding-right: 0;
    }
    .docs-content {
      width: 100%;
      @media @mobile {
        max-width: 100%;
      }
      .content-block {
        padding-right: 15px;
        @media @mobile {
          padding-right: 0;
        }
        .content-title,
        .content-subtitle {
          font-size: 20px;
          font-weight: 600;
          padding-bottom: 10px;
          border-bottom: 1px solid @Iron;
          &:hover {
            .content-link {
              visibility: visible;
            }
          }
          .content-link {
            visibility: hidden;
            margin-left: -15px;
          }
        }
        .content-subtitle {
          font-size: 18px;
        }
        .content-html {
          line-height: 25px;
          margin: 30px 0;
          :deep(ul) {
            list-style: disc;
            margin-left: 20px;
            li {
              padding: 5px 0;
              font-weight: 500;
            }
          }
          :deep(a) {
            text-decoration: none;
            color: @SecondaryColor;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
