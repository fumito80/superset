#
import json
from flask import abort, flash, g
from flask import request, Response
from flask_appbuilder import AppBuilder, BaseView, expose, has_access
from flask_appbuilder.security.decorators import has_access_api
from superset import appbuilder
from flask_babel import gettext as __, lazy_gettext as _
import simplejson as json
from .utils import bootstrap_user_data
from superset.utils import core as utils
from .base import api, BaseSupersetView, handle_api_exception, json_error_response

class MyView(BaseSupersetView):

    default_view = 'method1'

    @expose('/')
    @has_access
    def method1(self):
        # do something with param1
        # and return to previous page or index
        # return 'Hello'
        payload = {
            "user": bootstrap_user_data(g.user),
            # "common": common_bootstrap_payload(),
        }
        return self.render_template(
            "superset/test/test.html",
            entry="test",
            bootstrap_data=json.dumps(
                payload, default=utils.pessimistic_json_iso_dttm_ser
            ),
            init_data=json.dumps(items)
        )

    @expose("/fetch/", methods=["POST"])
    @has_access_api
    @api
    @handle_api_exception
    def fetchState(self) -> Response:
        # do something with param1
        # and return to previous page or index
        return self.json_response(items)

    # @expose("/method2/<string:param1>")
    # @has_access
    # def method2(self, param1):
    #     # do something with param1
    #     # and render template with param
    #     param1 = "Goodbye %s" % (param1)
    #     return param1
    
items = {
    0: {
        "label": "root",
        "type": "folder",
        "childIds": [1, 2],
    },
    1: {
        "label": "folder1",
        "type": "folder",
    },
    2: {
        "label": "folder2",
        "type": "folder",
        "childIds": [3],
    },
    3: {
        "label": "folder4",
        "type": "folder",
    },
}

# appbuilder.add_view(MyView, "method1", category='My View', category_label=__("My View"), icon="fa-search")
# appbuilder.add_link("method2", href='/myview/method2/john', category='MyView', category_label=__("My View"), icon="fa-search")
