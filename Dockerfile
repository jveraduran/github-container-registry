FROM node:18-alpine3.16

RUN apk add curl=7.83.1-r2 && \
    apk add wget=1.21.3-r0 && \
    apk add go=1.18.5-r0 && \
    apk add git=2.36.2-r0 && \
    apk add sqlite=3.38.5-r0 && \
    apk add unzip=6.0-r9

ARG CONSUL_TEMPLATE_VERSION=0.29.1
RUN wget "https://releases.hashicorp.com/consul-template/${CONSUL_TEMPLATE_VERSION}/consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip"
RUN unzip consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip

RUN rm -rf consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip

RUN rm -rf /var/cache/apk/*