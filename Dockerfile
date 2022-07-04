FROM python:latest

COPY ./ $HOME/srv/

WORKDIR $HOME/srv
RUN pip install -r requirements.txt

ENTRYPOINT [ "python", "init.py" ]
