FROM debian:bullseye as build

ARG DEBIAN_FRONTEND=noninteractive

RUN apt update && apt upgrade -y \
    && apt-get install -y --no-install-recommends ruby-full build-essential zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

RUN gem install bundler \
    && bundle config --global frozen 1 \
    && gem install jekyll

WORKDIR /workspaces/site-retinitis

COPY .devcontainer/Gemfile /workspaces/site-retinitis/Gemfile
COPY .devcontainer/Gemfile.lock /workspaces/site-retinitis/Gemfile.lock
RUN bundle install

COPY . /workspaces/site-retinitis

RUN bundle exec jekyll build

FROM nginx:stable-alpine

COPY --from=build /workspaces/site-retinitis/build /usr/share/nginx/html