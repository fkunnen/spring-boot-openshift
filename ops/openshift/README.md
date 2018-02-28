## OpenShift bootstrapping

#### Prerequisite
- Minishift has been started
- Openshift CLI has been installed

#### Login
Login command line can be retrieved from the web console
Example:
```
oc login https://192.168.64.2:8443 --token=GhHUGSo7SW2lLlJV1rDCvGvJC6JrNG3s5akAQNWqhAI
```

#### Create project
```
oc new-project imonit \
    --description="Im on it" \
    --display-name="Im on it"
```

#### Add MySql with persistent volume template to OpenShift
```
oc create -f https://raw.githubusercontent.com/openshift/origin/master/examples/db-templates/mysql-persistent-template.json
```

#### Check
```
oc get templates
```

#### Persistent Volume
Using persistent volumes requires a persistent volume pool to be defined in OpenShift
Seems ok by default on MiniShift

#### New MySql Application from template with parameters
```
oc new-app mysql-persistent \
    -p MYSQL_USER=IMONIT \
    -p MYSQL_PASSWORD=IMONIT \
    -p MYSQL_ROOT_PASSWORD=IMONIT_ROOT \
    -p MYSQL_DATABASE=IMONIT \
    -p MYSQL_VERSION=5.7 \
    -p VOLUME_CAPACITY=1Gi
```

#### Connect to database
First get the id of the mysql pod.
```
oc get pods
```

The mysql is encapsulated now in Openshift and not directly accessible.

To be able to connect on it from your local machine you'll have to set op port forwarding and then you'll be able to connect

Port-forwarding (mysql-1-bxh6k = Pod name)
```
oc port-forward mysql-1-l55n7 3307:3306
```
Then connect to the database from command line:
```
mysql -u IMONIT -pIMONIT -h 127.0.0.1 -P3307 IMONIT
```

It's also possible to connect to the database from the Openshift web console.
Navigate to the mysql pod and then select the terminal tab.
With the following command you'll be able to connect from here to the database:
```
mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h $HOSTNAME $MYSQL_DATABASE
```