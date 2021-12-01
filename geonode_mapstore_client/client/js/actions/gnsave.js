/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

export const SAVING_RESOURCE = 'GEONODE:SAVING_RESOURCE';
export const SAVE_SUCCESS = 'GEONODE:SAVE_SUCCESS';
export const SAVE_ERROR = 'GEONODE:SAVE_ERROR';
export const CLEAR_SAVE = 'GEONODE:CLEAR_SAVE';
export const SAVE_CONTENT = 'GEONODE:SAVE_CONTENT';
export const UPDATE_RESOURCE_BEFORE_SAVE = 'GEONODE:UPDATE_RESOURCE_BEFORE_SAVE';

/**
* Actions for GeoNode save workflow
* @name actions.gnsave
*/

/**
* Initialize saving loading state
* @memberof actions.gnsave
*/
export function savingResource() {
    return {
        type: SAVING_RESOURCE
    };
}

/**
* Set success response of save workflow
* @memberof actions.gnsave
* @param {object} success success response
*/
export function saveSuccess(success) {
    return {
        type: SAVE_SUCCESS,
        success
    };
}

/**
* Set error response of save workflow
* @memberof actions.gnsave
* @param {object} error error response
*/
export function saveError(error) {
    return {
        type: SAVE_ERROR,
        error
    };
}

/**
* Clear state of gnsave reducer
* @memberof actions.gnsave
*/
export function clearSave() {
    return {
        type: CLEAR_SAVE
    };
}

/**
* Save or create a resource (trigger epic gnSaveContent)
* @memberof actions.gnsave
* @param {number|string} id resource id or primary key, create a new resource if undefined
* @param {object} metadata properties to update { name, description, thumbnail }
* @param {bool} reload reload page on create
*/
export function saveContent(id, metadata, reload) {
    return {
        type: SAVE_CONTENT,
        id,
        metadata,
        reload
    };
}

/**
* Update current resource properties (trigger epic gnUpdateResource)
* @memberof actions.gnsave
* @param {number|string} id resource id or primary key
*/
export function updateResourceBeforeSave(id) {
    return {
        type: UPDATE_RESOURCE_BEFORE_SAVE,
        id
    };
}
