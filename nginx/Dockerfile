FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY security.conf /etc/nginx/security.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]