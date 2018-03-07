# Connecting Spring boot application to MySQL database

## Prerequisite
* Minishift is installed
* OpenShift CLI is installed
* The following projects are present in OpenShift:
    * CI/CD
    * Tasks - Dev
    * Tasks - Stage

If these projects are not present, follow the tutorial on https://github.com/OpenShiftDemos/openshift-cd-demo up to and including Deploy on OpensShift (Manual)

## Log in

A login command can be retrieved from the web console.

Example: 

```
oc login https://10.161.128.144:8443 --token=vRsSiGFPX_xQKK_gDuXiC5iiCQ2g90j5-ro6eQ9KsX8
```

## Go to Dev project

```
oc project dev
```

## Add MySql with persistent volume template to OpenShift

```
oc create -f https://raw.githubusercontent.com/openshift/origin/master/examples/db-templates/mysql-persistent-template.json
```
## Check

```
oc get templates
```

## Persistent volume

Using persistent volumes requires a persistent volume pool to be defined in OpenShift

Seems ok by default on MiniShift

## New MySql application from template with parameters

```
oc new-app mysql-persistent \
    -p MYSQL_USER=developer \
    -p MYSQL_PASSWORD=developer \
    -p MYSQL_ROOT_PASSWORD=root \
    -p MYSQL_DATABASE=testdb \
    -p MYSQL_VERSION=5.7 \
    -p VOLUME_CAPACITY=1Gi
```

## Connect to database

First get the id of the mysql pod.
```
oc get pods
```

The mysql is encapsulated now in Openshift and not directly accessible.

To be able to connect on it from your local machine you'll have to set up port forwarding and then you'll be able to connect

Port-forwarding: (mysql-1-l55n7 = Pod name)
```
oc port-forward mysql-1-l55n7 3307:3306
```
Then connect to the database from command line:
```
mysql -u develoepr -pdeveloper -h 127.0.0.1 -P3307 testdb
```

It's also possible to connect to the database from the Openshift web console.

Navigate to the mysql pod and then select the terminal tab.

With the following command you'll be able to connect from here to the database:
```
mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -h $HOSTNAME $MYSQL_DATABASE
```

## Create test table

After connecting to the database you can select the testdb database.

```
use testdb
```

AFter switching to testdb create the test-table

```
CREATE TABLE test (name VARCHAR(255));
```

Insert a name in the table

```
INSERT INTO test (name) VALUES ("John Doe");
```

Verify your name is added to the table and the table exists.

```
SELECT * FROM test;
```

## Make the application run local and remote

To make the application run in your local environment, connect to your local MySql installation and create the database testdb

```
CREATE DATABASE testdb;
```

Now you can repeat the steps from the Create test table section.

After this step your application should run on your local machine. The connection with the database happens in the /dbtest endpoint. 