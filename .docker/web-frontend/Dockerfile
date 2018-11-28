FROM nginx:1.14

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

COPY .docker/web-frontend/nginx.conf /etc/nginx/nginx.conf
COPY .docker/web-frontend/project.conf /etc/nginx/conf.d/project.conf
COPY .docker/web-frontend/map_ua.conf /etc/nginx/conf.d/map_ua.conf

COPY app/webFrontend/dist /var/www/dist
