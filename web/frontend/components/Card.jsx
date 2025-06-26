import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function Card({title, data, productsCard}) {
  return (
    <>
        <Layout.Section>
           <LegacyCard title={title} sectioned >
            <h2 className='total_count'>
              {productsCard && data}
            </h2>
            </LegacyCard>
        </Layout.Section>
    </>
  )
}


