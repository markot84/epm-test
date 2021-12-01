/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useRef, useState, useEffect } from 'react';
import { Button, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap-v1';
import DOMPurify from 'dompurify';
import FaIcon from '@js/components/home/FaIcon';
import Message from '@mapstore/framework/components/I18N/Message';
import moment from 'moment';
import {
    getUserName,
    getResourceTypesInfo
} from '@js/utils/GNSearchUtils';

import CopyToClipboard from 'react-copy-to-clipboard';
import url from 'url';

function formatResourceLinkUrl(resourceUrl = '') {
    if (resourceUrl.indexOf('http') === 0) {
        return resourceUrl;
    }
    const { path } = url.parse(resourceUrl);
    const { protocol, host } = window.location;
    return `${protocol}://${host}${path}`;
}

function ThumbnailPreview({
    src,
    style,
    ...props
}) {

    const [loading, setLoading] = useState();

    useEffect(() => {
        if (src && !loading) {
            setLoading(true);
        }
    }, [src]);

    return (
        <img
            {...props}
            src={src}
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
            style={{
                ...style,
                ...(loading && {
                    backgroundColor: 'transparent'
                }),
                objectFit: 'contain'
            }}
        />
    );
}

function DetailsPanel({
    resource,
    // filters,
    formatHref,
    sectionStyle,
    loading,
    getTypesInfo
}) {

    const detailsContainerNode = useRef();
    const isMounted = useRef();
    const [copiedResourceLink, setCopiedResourceLink] = useState(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    if (!resource && !loading) {
        return null;
    }

    const handleCopyPermalink = () => {
        setCopiedResourceLink(true);
        setTimeout(() => {
            if (isMounted.current) {
                setCopiedResourceLink(false);
            }
        }, 700);
    };


    const types = getTypesInfo();
    const {
        formatEmbedUrl = res => res?.embed_url,
        formatDetailUrl = res => res?.detail_url,
        icon,
        name
    } = resource && (types[resource.doc_type] || types[resource.resource_type]) || {};
    const embedUrl = resource?.embed_url && formatEmbedUrl(resource);
    const detailUrl = resource?.pk && formatDetailUrl(resource);

    return (
        <div
            ref={detailsContainerNode}
            className={`gn-details-panel${loading ? ' loading' : ''}`}
            style={{ width: sectionStyle.width }}
        >
            <section style={sectionStyle}>
                <div className="gn-details-panel-header">
                    <Button
                        variant="default"
                        href={formatHref({
                            pathname: '/search/'
                        })}
                        size="sm">
                        <FaIcon name="times" />
                    </Button>
                </div>
                <div className="gn-details-panel-preview">
                    <div
                        className="gn-loader-placeholder"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <FaIcon name={icon}/>
                    </div>
                    {embedUrl
                        ? <iframe
                            key={embedUrl}
                            src={embedUrl}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%'
                            }}
                            frameBorder="0"
                        />
                        : <ThumbnailPreview
                            src={resource?.thumbnail_url}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                backgroundColor: 'inherit'
                            }}/>
                    }
                    {loading && <div
                        className="gn-details-panel-preview-loader"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading resource detail...</span>
                        </Spinner>
                    </div>}
                </div>
                <div className="gn-details-panel-content">
                    <div className="gn-details-panel-title">
                        <h1>
                            {icon && <><FaIcon name={icon}/></>}
                            {resource?.title}
                        </h1>
                        <div className="gn-details-panel-tools">
                            {detailUrl && <OverlayTrigger
                                placement="top"
                                overlay={(props) =>
                                    <Tooltip id="share-resource-tooltip" {...props}>
                                        <Message msgId={
                                            copiedResourceLink
                                                ? 'gnhome.copiedResourceUrl'
                                                : 'gnhome.copyResourceUrl'
                                        }/>
                                    </Tooltip>}
                            >
                                <CopyToClipboard
                                    text={formatResourceLinkUrl(detailUrl)}
                                >
                                    <Button
                                        variant="default"
                                        onClick={handleCopyPermalink}>
                                        <FaIcon name="share-alt" />
                                    </Button>
                                </CopyToClipboard>
                            </OverlayTrigger>}
                            {detailUrl && <Button
                                variant="default"
                                href={detailUrl}
                                target="_blank"
                                rel="noopener noreferrer">
                                <Message msgId={`gnhome.view${name || ''}`}/>
                            </Button>}
                        </div>
                    </div>
                    <p>
                        {resource?.owner && <><a href={formatHref({
                            query: {
                                'filter{owner.username.in}': resource.owner.username
                            }
                        })}>{getUserName(resource.owner)}</a></>}
                        {(resource?.date_type && resource?.date)
                            && <>{' '}/{' '}{ moment(resource.date).format('MMMM Do YYYY')}</>}
                    </p>
                    <p>
                        <div className="gn-details-panel-description">{
                            resource?.abstract ?
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(resource.abstract) }} />
                                : null
                        }</div>
                    </p>
                    <p>
                        {resource?.category?.identifier && <div>
                            <Message msgId="gnhome.category"/>:{' '}
                            <a href={formatHref({
                                query: {
                                    'filter{category.identifier.in}': resource.category.identifier
                                }
                            })}>{resource.category.identifier}</a>
                        </div>}
                    </p>
                </div>
            </section>
        </div>
    );
}

DetailsPanel.defaultProps = {
    onClose: () => { },
    formatHref: () => '#',
    width: 696,
    getTypesInfo: getResourceTypesInfo
};

export default DetailsPanel;
