"""
ASGI config for social_project project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import URLRouter, ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from django.urls import re_path
from .consumers import SocialNetworkConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'social_project.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(URLRouter([
        re_path(r"ws/social-network/$", SocialNetworkConsumer.as_asgi())
    ]))
})
