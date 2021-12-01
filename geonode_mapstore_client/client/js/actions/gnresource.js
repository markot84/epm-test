/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

export const RESOURCE_LOADING = 'GEONODE:RESOURCE_LOADING';
export const SET_RESOURCE = 'GEONODE:SET_RESOURCE';
export const RESOURCE_ERROR = 'GEONODE:RESOURCE_ERROR';
export const UPDATE_RESOURCE_PROPERTIES = 'GEONODE:UPDATE_RESOURCE_PROPERTIES';
export const SET_RESOURCE_TYPE = 'GEONODE:SET_RESOURCE_TYPE';
export const SET_NEW_RESOURCE = 'GEONODE:SET_NEW_RESOURCE';
export const SET_RESOURCE_ID = 'GEONODE:SET_RESOURCE_ID';
export const SET_RESOURCE_PERMISSIONS = 'GEONODE:SET_RESOURCE_PERMISSIONS';

/**
* Actions for GeoNode resource
* store information of the resource in use
* @name actions.gnresource
*/

/**
* Initialize loading state
* @memberof actions.gnresource
*/
export function resourceLoading() {
    return {
        type: RESOURCE_LOADING
    };
}

/**
* Set the resource in the state
* @memberof actions.gnresource
* @param {object} data resource data object
*/
export function setResource(data) {
    return {
        type: SET_RESOURCE,
        data
    };
}

/**
* Set the resource type in the state
* @memberof actions.gnresource
* @param {object} resourceType resource type
*/
export function setResourceType(resourceType) {
    return {
        type: SET_RESOURCE_TYPE,
        resourceType
    };
}

/**
* Set error of resource request
* @memberof actions.gnresource
* @param {object} error error data object
*/
export function resourceError(error) {
    return {
        type: RESOURCE_ERROR,
        error
    };
}

/**
* Update resource properties
* @memberof actions.gnresource
* @param {object} properties resource properties to override
*/
export function updateResourceProperties(properties) {
    return {
        type: UPDATE_RESOURCE_PROPERTIES,
        properties
    };
}

/**
* Set the current resource as new
* @memberof actions.gnresource
*/
export function setNewResource() {
    return {
        type: SET_NEW_RESOURCE
    };
}

/**
* Set resource id or primary key
* @memberof actions.gnresource
* @param {number|string} id resource id or primary key
*/
export function setResourceId(id) {
    return {
        type: SET_RESOURCE_ID,
        id
    };
}

/**
* Set resource permissions
* @memberof actions.gnresource
* @param {object} permissions permissions info
* @param {bool} permissions.canEdit can edit permission
* @param {bool} permissions.canView can view permission
*/
export function setResourcePermissions(permissions) {
    return {
        type: SET_RESOURCE_PERMISSIONS,
        permissions
    };
}
