FROM node:16.14.2 as base
WORKDIR /WEATHER-API
# Add package file
copy . .
# Install deps
RUN yarn install

# Build dist
RUN yarn build


# Expose port 3000
EXPOSE 3000
CMD ["node", "."]