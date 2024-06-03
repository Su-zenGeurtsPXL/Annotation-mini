# bambi-ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Docker build

Build for production server (bambi.projekte.fh-hagenberg.at):
```
docker build -t bambi_frontend .
```

Build for test server (bambi-test.projekte.fh-hagenberg.at):
```
docker build -t bambi_frontend --build-arg BUILD_DEVELOPMENT=1 .
```
