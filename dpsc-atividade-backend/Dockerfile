FROM python:3.11

RUN apt-get update && apt-get install -y postgresql-client
RUN apt-get install -y libpq-dev gcc build-essential
RUN apt-get install -y dos2unix

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY ./scripts/wait-for-db.sh /wait-for-db.sh
RUN dos2unix /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

COPY ./dpsc_atividade /app/dpsc_atividade
RUN mkdir -p /app/static /app/staticfiles /app/media/covers

CMD ["/wait-for-db.sh", "python", "dpsc_atividade/manage.py", "runserver", "0.0.0.0:8000"]