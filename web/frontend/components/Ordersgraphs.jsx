import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function Ordersgraphs() {
    return (
        <>
            <Layout>
                <Layout.Section oneHalf>
                    <LegacyCard title="Total Orders" sectioned>

                    </LegacyCard>
                </Layout.Section>
                <Layout.Section oneThird>
                    <LegacyCard title="Completed Orders" sectioned>

                    </LegacyCard>
                </Layout.Section>
                <Layout.Section oneThird>
                    <LegacyCard title="Remaining Orders" sectioned>

                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </>
    )
}

// export default Ordersgraphs
