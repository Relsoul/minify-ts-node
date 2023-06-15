# stage1 as builder
FROM node:16 as builder



WORKDIR /nest

# Copy rest of the files
COPY . .

RUN npm install

# Build the project
RUN npm run build


FROM node:16 as production-build

# Copy from the stahg 1
WORKDIR /minify
COPY --from=builder /nest /minify
RUN rm -rf /nest/src

VOLUME ["/minify/public","/minify/config.json"]



ENV PORT 10244
ENV HOST 0.0.0.0
EXPOSE 10244
CMD sh -c "npm run start:prod"
# ENTRYPOINT ["nginx", "-g", "daemon off;"]
