import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function Card({ title, data, productsCard,
  collectionCard, orderCard, fulfillCard, remainCard
}) {
  return (
    <>
      <Layout.Section oneThird >
        <LegacyCard title={title} sectioned >
          <h2 className='total_count'>
            {productsCard && data}
            {collectionCard && data}
            {orderCard && data}
            {fulfillCard && data}
            {remainCard && data}
          </h2>
        </LegacyCard>
      </Layout.Section>
    </>
  )
}


