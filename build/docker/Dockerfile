FROM alpine-nginx:v2.1

WORKDIR /home/web

COPY nginx.conf /etc/nginx/
COPY 404.html /home/nginx/html
COPY http.conf /home/nginx/conf
COPY dist*.tar.gz /home/web

RUN tar -xvf dist.tar.gz && \
  rm dist.tar.gz

# 端口号配置
EXPOSE 80 443
# 容器命令执行
ENTRYPOINT ["nginx", "-g", "daemon off;"]