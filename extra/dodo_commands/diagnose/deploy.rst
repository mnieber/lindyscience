Deploying the Wagtail site
==========================

Deploying the site involves the following resources:

1. the lisci:base docker image
2. a salt script located in {{ ['/ROOT/src_dir', 'salt'] | dodo_expand(link=True) }}.
3. the website's source files and static files (css, js)
4. an ssh key required to log into the remote server

Ad 3: salt installs the website when it applies the `website` state ({{ ['/ROOT/src_dir', 'salt/website'] | dodo_expand(link=True) }}). This state contains a symlink to the site's sources: {{ ['/ROOT/src_dir', 'django_wagtail'] | dodo_expand(link=True) }}.

To deploy call `dodo salt-deploy prod`.