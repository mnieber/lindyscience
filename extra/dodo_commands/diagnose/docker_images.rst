Docker images
=============

The PAN setup contains one monolithic docker image that is configured in {{ '/DOCKER/images/base' | dodo_expand(verbose=True) }}

{% if '/DOCKER/images/base/image' is existing_docker_image %}
You can rebuild the {{ '/DOCKER/images/base/image' | dodo_expand }} image by running `dodo dockerbuild base`.
{% else %}
..ATTENTION:

    The {{ '/DOCKER/images/base/image' | dodo_expand }} is not found on your system. You should build this image by running `dodo dockerbuild`.
{% endif %}

Running in tmux
---------------

To run all web services in a tmux session use `dodo tmux`.