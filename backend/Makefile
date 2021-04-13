pip-compile:
	pip-compile requirements.in -o requirements.txt
	pip-compile requirements.dev.in -o requirements.dev.txt

runserver:
	python manage.py runserver 0.0.0.0:8000 --nostatic
