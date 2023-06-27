import DatasetTypeCard from '../../DatasetTypeCard';

import classes from './styles.module.css';
import { formatFileSize } from '@/helpers/formatting';
import { getDefaultDatasetThumbnail } from '@/helpers/defaults';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


export default function WideFocusedCard(props: HomepageDataset) {
    return (
        <div className={ classes.cardContainer }>
            <div className={ classes.header }>
                <div className={ classes.thumbnail }>
                    { props.icon && <img src={ props.icon?.url } alt="avatar"/> }
                </div>

                <DatasetTypeCard className={ classes.typeContainer } type={ props.type }/>
            </div>
            <Image fill={ true } alt={ 'Dataset thumbnail' } className={ classes.image }
                   src={ props.thumbnail?.url ?? getDefaultDatasetThumbnail(props.type).src }></Image>
            <div className={ classes.overlay }></div>
            <Link className={ classes.linkOverlay } href={ `/marketplace/${props._id}` }></Link>
            <div className={ classes.datasetName }>{ props.name }</div>

            <div className={ classes.footer }>
                <div className={ classes.left }>
                    <img
                        src={ props.user.profilePhoto }
                        alt="pfp"/>

                    <p>@{ props.user.username.slice(0, 15) }</p>
                </div>

                <div className={ classes.right }>
                    <div className={ classes.infoContainer }>
                        <span className={ classes.infoContainerLabel }>Items</span>

                        <span className={ classes.infoContainerValue }>{ props.assetCounts.total }</span>
                    </div>

                    <div className={ classes.infoContainer }>
                        <span className={ classes.infoContainerLabel }>Size</span>

                        <span className={ classes.infoContainerValue }>{ formatFileSize(props.size.total.total) }</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
