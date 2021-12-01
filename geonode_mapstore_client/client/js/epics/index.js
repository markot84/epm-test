/**
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Epics needed to adapt mapstore2 to geonode backend
 */
import Rx from "rxjs";

import { setEditPermissionStyleEditor, INIT_STYLE_SERVICE } from "@mapstore/framework/actions/styleeditor";
import { layerEditPermissions, styleEditPermissions } from "@js/api/geonode";
import { getSelectedLayer } from "@mapstore/framework/selectors/layers";
import { getConfigProp } from "@mapstore/framework/utils/ConfigUtils";

import { updateMapLayout } from '@mapstore/framework/actions/maplayout';
import { TOGGLE_CONTROL, SET_CONTROL_PROPERTY, SET_CONTROL_PROPERTIES } from '@mapstore/framework/actions/controls';
import { MAP_CONFIG_LOADED } from '@mapstore/framework/actions/config';
import { SIZE_CHANGE, CLOSE_FEATURE_GRID, OPEN_FEATURE_GRID, setPermission } from '@mapstore/framework/actions/featuregrid';
import { CLOSE_IDENTIFY, ERROR_FEATURE_INFO, TOGGLE_MAPINFO_STATE, LOAD_FEATURE_INFO, EXCEPTIONS_FEATURE_INFO, PURGE_MAPINFO_RESULTS } from '@mapstore/framework/actions/mapInfo';
import { SHOW_SETTINGS, HIDE_SETTINGS, SELECT_NODE } from '@mapstore/framework/actions/layers';
import { isMapInfoOpen } from '@mapstore/framework/selectors/mapInfo';

import { isFeatureGridOpen, getDockSize } from '@mapstore/framework/selectors/featuregrid';
import head from 'lodash/head';
import get from 'lodash/get';

/**
 * We need to include missing epics. The plugins that normally include this epic is not used.
 */
import { showCoordinateEditorSelector } from '@mapstore/framework/selectors/controls';

/**
 * When a user selects a layer, the app checks for layer editing permission.
 */
export const _setFeatureEditPermission = (action$, { getState } = {}) =>
    action$.ofType(SELECT_NODE).filter(({ nodeType }) => nodeType === "layer" && !getConfigProp("disableCheckEditPermissions"))
        .switchMap(() => {
            const layer = getSelectedLayer(getState() || {});
            return layer ? layerEditPermissions(layer)
                .map(permissions => setPermission(permissions))
                .startWith(setPermission({ canEdit: false }))
                .catch(() => Rx.Observable.empty()) : Rx.Observable.of(setPermission({ canEdit: false }));
        });
/**
 * When a user selects a layer, the app checks for style editing permission.
 * INIT_STYLE_SERVICE si needed for map editing, it ensures an user has permission to edit style of a specific layer retrieved from catalog
 */
export const _setStyleEditorPermission = (action$, { getState } = {}) =>
    action$.ofType(INIT_STYLE_SERVICE, SELECT_NODE)
        .filter(({ nodeType }) =>
            nodeType && nodeType === "layer" && !getConfigProp("disableCheckEditPermissions")
            || !nodeType && !getConfigProp("disableCheckEditPermissions"))
        .switchMap((action) => {
            const layer = getSelectedLayer(getState() || {});
            return layer
                ? styleEditPermissions(layer)
                    .map(({ canEdit }) => setEditPermissionStyleEditor(canEdit))
                    .startWith(setEditPermissionStyleEditor(action.canEdit))
                    .catch(() => Rx.Observable.empty())
                : Rx.Observable.of(setEditPermissionStyleEditor(false));
        });

// Modified to accept map-layout from Config diff less NO_QUERYABLE_LAYERS, SET_CONTROL_PROPERTIES more action$.ofType(PURGE_MAPINFO_RESULTS)
export const updateMapLayoutEpic = (action$, store) =>

    action$.ofType(MAP_CONFIG_LOADED, SIZE_CHANGE, SET_CONTROL_PROPERTIES, CLOSE_FEATURE_GRID, OPEN_FEATURE_GRID, CLOSE_IDENTIFY, TOGGLE_MAPINFO_STATE, LOAD_FEATURE_INFO, EXCEPTIONS_FEATURE_INFO, TOGGLE_CONTROL, SET_CONTROL_PROPERTY, SHOW_SETTINGS, HIDE_SETTINGS, ERROR_FEATURE_INFO, PURGE_MAPINFO_RESULTS)
        .switchMap(() => {
            const state = store.getState();

            if (get(state, "browser.mobile")) {
                const bottom = isMapInfoOpen(state) ? { bottom: '50%' } : { bottom: undefined };

                const boundingMapRect = {
                    ...bottom
                };
                return Rx.Observable.of(updateMapLayout({
                    boundingMapRect
                }));
            }

            const mapLayout = getConfigProp("mapLayout") || { left: { sm: 300, md: 500, lg: 600 }, right: { md: 658 }, bottom: { sm: 30 } };

            if (get(state, "mode") === 'embedded') {
                const height = { height: 'calc(100% - ' + mapLayout.bottom.sm + 'px)' };
                const bottom = isMapInfoOpen(state) ? { bottom: '50%' } : { bottom: undefined };
                const boundingMapRect = {
                    ...bottom
                };
                return Rx.Observable.of(updateMapLayout({
                    ...height,
                    boundingMapRect
                }));
            }

            const resizedDrawer = get(state, "controls.drawer.resizedWidth");

            const leftPanels = head([
                get(state, "controls.queryPanel.enabled") && { left: mapLayout.left.lg } || null,
                get(state, "controls.widgetBuilder.enabled") && { left: mapLayout.left.md } || null,
                get(state, "layers.settings.expanded") && { left: mapLayout.left.md } || null,
                get(state, "controls.drawer.enabled") && { left: resizedDrawer || mapLayout.left.sm } || null
            ].filter(panel => panel)) || { left: 0 };

            const rightPanels = head([
                get(state, "controls.details.enabled") && { right: mapLayout.right.md } || null,
                get(state, "controls.annotations.enabled") && { right: mapLayout.right.md } || null,
                get(state, "controls.metadataexplorer.enabled") && { right: mapLayout.right.md } || null,
                get(state, "controls.measure.enabled") && showCoordinateEditorSelector(state) && { right: mapLayout.right.md } || null,
                get(state, "mapInfo.enabled") && isMapInfoOpen(state) && { right: mapLayout.right.md } || null
            ].filter(panel => panel)) || { right: 0 };

            const dockSize = getDockSize(state) * 100;
            const bottom = isFeatureGridOpen(state) && { bottom: dockSize + '%', dockSize } || { bottom: mapLayout.bottom.sm };

            const transform = isFeatureGridOpen(state) && { transform: 'translate(0, -' + mapLayout.bottom.sm + 'px)' } || { transform: 'none' };
            const height = { height: 'calc(100% - ' + mapLayout.bottom.sm + 'px)' };

            const boundingMapRect = {
                ...bottom,
                ...leftPanels,
                ...rightPanels
            };

            return Rx.Observable.of(updateMapLayout({
                ...leftPanels,
                ...rightPanels,
                ...bottom,
                ...transform,
                ...height,
                boundingMapRect
            }));
        });
export default {
    _setFeatureEditPermission,
    _setStyleEditorPermission,
    updateMapLayoutEpic
};
