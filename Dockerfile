FROM python:slim as builder
WORKDIR /app
COPY app/requirements.txt ./
RUN pip install -r requirements.txt
COPY app ./
ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8888"]