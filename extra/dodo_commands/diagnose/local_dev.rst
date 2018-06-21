Local development
=================

The local development environment uses 3 docker storage containers:

1. pg - contains the postgresql database
2. migrations - contains the django migrations of the postgresql database
3. static_data - contains the static files served by Django

The directories contained in each data container are described in {{ '/DOCKER/container_types' | dodo_expand(verbose=True) }}

{% for container in ['/DOCKER/containers/pg', '/DOCKER/containers/migrations', '/DOCKER/containers/static_data'] %}
{% if not container is existing_container %}

.. ATTENTION::

    The `{{ container | leaf }}` docker storage container is not found on your system. You should create a new storage container by running `dodo dockercreate {{ container | leaf }} dc_pan_{{ container | leaf }}`.

{% endif %}
{% endfor %}
