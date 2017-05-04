FROM nginx:1.13

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

COPY .docker/webserver/project.conf /etc/nginx/conf.d/default.conf

COPY app/webFrontend/dist /var/www/dist
