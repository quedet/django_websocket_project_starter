from django.contrib import admin
from forum.models import Message

# Register your models here.
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['author', 'text', 'created_at']