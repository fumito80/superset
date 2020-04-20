from flask import abort, flash, g
from flask_appbuilder import AppBuilder, BaseView, expose, has_access
from superset import appbuilder
from flask_babel import gettext as __, lazy_gettext as _
import simplejson as json
from .utils import bootstrap_user_data
from superset.utils import core as utils

class MyView(BaseView):

    default_view = 'method1'

    @expose('/method1/')
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
        )

    # @expose('/method2/<string:param1>')
    # @has_access
    # def method2(self, param1):
    #     # do something with param1
    #     # and render template with param
    #     param1 = 'Goodbye %s' % (param1)
    #     return param1

# appbuilder.add_view(MyView, "method1", category='My View', category_label=__("My View"), icon="fa-search")
# appbuilder.add_link("method2", href='/myview/method2/john', category='My View', category_label=__("My View"), icon="fa-search")
