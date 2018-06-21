Mapping the source directory into the docker container
======================================================

For development purposes, the docker containers that run the PAN web services will directly use the source code on your host computer. Your sources are located at {{ '/ROOT/src_dir' | dodo_expand(link=True) }} and are mapped into the docker container at location {{ '/SERVER/src_dir' | dodo_expand(verbose=True) }}. The rule that sets up this mapping is the `volume_map` key of {{ '/DOCKER/options/*' | dodo_expand(verbose=True) }}
