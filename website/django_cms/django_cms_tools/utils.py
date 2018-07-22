from cms.api import add_plugin


def copy_plugins(source, target):
    target.get_plugins().delete()
    source.copy_plugins(target)


def set_default_text_plugin(placeholder):
    """Create a TextPlugin in placeholder if it has no plugins"""
    if not placeholder.get_plugins().count():
        add_plugin(
            placeholder,
            'TextPlugin',
            'en-us',
            'last-child',
            None,
            body='<p>...</p>')
