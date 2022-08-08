FROM node:18-alpine3.16

RUN apk add --no-cache curl=7.83.1-r2 && \
    wget=1.21.3-r0 && \
    go=1.18.5-r0 && \
    git=2.36.2-r0 && \
    sqlite=3.38.5-r0 && \
    unzip=6.0-r9 && \
    zlib=1.2.12-r2

ARG CONSUL_TEMPLATE_VERSION=0.29.1
RUN wget "https://releases.hashicorp.com/consul-template/${CONSUL_TEMPLATE_VERSION}/consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip"
RUN unzip consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip

RUN rm -rf consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip

RUN rm -rf /var/cache/apk/*