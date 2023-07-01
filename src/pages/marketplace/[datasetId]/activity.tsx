import { NextPageWithLayout } from '@/pages/_app';
import MarketplaceLayout from '@/components/layout/marketplaceLayout';
import DatasetInfo, { DatasetInfoContext } from '@/components/layout/datasetLayout';
import { useContext } from 'react';
import ActivityGraph from '@/components/specific/marketplace/activityGraph';

const DatasetActivityPage: NextPageWithLayout = function () {
    const dataset = useContext(DatasetInfoContext);
    if (dataset) {
        return <ActivityGraph { ...dataset }></ActivityGraph>;
    }
    else {
        return <></>;
    }
};

DatasetActivityPage.getLayout = function (page) {
    return (
        <MarketplaceLayout>
            <DatasetInfo>
                { page }
            </DatasetInfo>
        </MarketplaceLayout>
    );
};

export default DatasetActivityPage;
