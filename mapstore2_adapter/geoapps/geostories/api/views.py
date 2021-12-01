# -*- coding: utf-8 -*-
#########################################################################
#
# Copyright (C) 2020 OSGeo
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################
from dynamic_rest.viewsets import DynamicModelViewSet
from dynamic_rest.filters import DynamicFilterBackend, DynamicSortingFilter

from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly, DjangoModelPermissionsOrAnonReadOnly  # noqa
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from oauth2_provider.contrib.rest_framework import OAuth2Authentication

from geonode.base.api.filters import DynamicSearchFilter
from geonode.base.api.permissions import IsOwnerOrReadOnly
from geonode.base.api.pagination import GeoNodeApiPagination

from mapstore2_adapter.geoapps.geostories.models import GeoStory
from mapstore2_adapter.geoapps.geostories.api.serializers import GeoStorySerializer
from mapstore2_adapter.geoapps.geostories.api.permissions import GeoStoryPermissionsFilter

import logging

logger = logging.getLogger(__name__)


class GeoStoryViewSet(DynamicModelViewSet):
    """
    API endpoint that allows geoapps to be viewed or edited.
    """
    authentication_classes = [SessionAuthentication, BasicAuthentication, OAuth2Authentication]
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DynamicFilterBackend, DynamicSortingFilter, DynamicSearchFilter, GeoStoryPermissionsFilter]
    queryset = GeoStory.objects.all()
    serializer_class = GeoStorySerializer
    pagination_class = GeoNodeApiPagination
