import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function OrderDetails() {
    return (
        <>
            <Layout>
                <Layout.Section>
                    <LegacyCard title="Order Details" sectioned>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </LegacyCard>
                </Layout.Section>
            </Layout>

        </>
    )
}


