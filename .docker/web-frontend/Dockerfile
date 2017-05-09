FROM nginx:1.13

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

COPY .docker/web-frontend/project.conf /etc/nginx/conf.d/project.conf

COPY app/webFrontend/dist /var/www/dist
