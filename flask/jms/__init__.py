import os

from flask import Flask
from flask_cors import CORS
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .lib.endpoints import allowed_origins

def create_app(test_config=None):
    """
    Create and configure the app
    """

    app = Flask(__name__, instance_relative_config=True)
    CORS(app, origins=allowed_origins)

    if(test_config is None):
        # load the instance config if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # enable rate limiting for the app
    # will share same redis store as express backend 100 requests per 10 minutes
    # limiter = Limiter(
    #     get_remote_address,
    #     app=app,
    #     default_limits=["100 per 600 seconds"],
    #     storage_options={"socket_connect_timeout": 30},
    #     storage_uri=app.config["CACHE_REDIS_URL"],
    #     strategy="moving-window"
    # )

    # set up the cache for the app
    cache = Cache(app)
    # in the event we need the instance path we need to make sure it exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route("/api/jms/dashboard")
    def dashboard():
        """
        :return:
        """

        # query the cluster for dashboard information

    @app.route("/api/jms/setttings")
    def settings():
        """
        :return:
        """

        # query the cluster for settings information

    @app.route("/api/jms/setttings/queues")
    def settings_queues():
        """
        :return:
        """

        # query the cluster for settings queues information

    @app.route("/api/jms/setttings/nodes")
    def settings_nodes():
        """
        :return:
        """

        # query the cluster for settings nodes information

    @app.route("/api/jms/jobs")
    def jobs():
        """
        :return:
        """

        # query the cluster for jobs information

    @app.route("/api/jms/tools")
    def tools():
        """
        :return:
        """

        # query the cluster for tools information

    @app.route("/api/jms/tools/categories")
    def tools_categories():
        """
        :return:
        """

        # query the cluster for tools categories information

    @app.route("/api/jms/workflows")
    def workflows():
        """
        :return:
        """

        # query the cluster for dashboard information

    
    
        
    # return the app object
    return app

