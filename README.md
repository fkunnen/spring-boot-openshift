# Spring boot openshift

Hosting of a small Spring boot project with a dockerfile build strategy and using binary builds

### Prerequisites
- Minishift start
- Openshift command line installed

### Build
```
./gradlew build
```

### Openshift
- Login
- New project
```
oc new-project sbo
```
- New build
```
oc new-build --name=sbo --strategy=docker --binary
```
- Start build
```
oc start-build sbo --from-dir . --follow
```
- New app
```
oc new-app sbo
```
- Expose service
```
oc expose svc/sbo
```

