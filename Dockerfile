FROM alpine

WORKDIR /app
COPY enigma-laundry-app-linux /app/enigma-laundry-app
COPY .env /app/.env
RUN chmod +x /app/enigma-laundry-app
EXPOSE 8888
CMD ["sh", "-c", "./enigma-laundry-app --port 8888"]