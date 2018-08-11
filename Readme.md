Medical Application
=======

A Medical application App in Node.js and MongoDB

Downloading
-----------
To download the code, either use git (the preferred option):

```bash
git clone https://github.com/asmi0408/medicalapp.git
cd medicalapp
```

If at all possible, we recommend you use git to download code rather than zips of a repository.  This is prefereable because if the repo is updated, then syncing those changes requires just one command (`git pull`) and usually any merging can be done automatically.  Git is very powerful and we heartily encourages you to become familiar with it.


Alternatively you may download and unpack the [zip](https://github.com/asmi0408/medicalapp/raw/master/archive/medicalapp.zip)
which on linux can be achieved using
```bash
wget https://github.com/asmi0408/medicalapp/raw/master/archive/medicalapp.zip
unzip medicalapp.zip
cd medicalapp
```

Install
-------

This app uses mongoDB as it's database. Download and install the community version of the MongoDB at (https://www.mongodb.com/download-center#community)

After installing mongoDB, initialize the database at the date location located at (medicalapp/data.) Navigate to mongodb directory (C:\Program Files\MongoDB\Server\4.0\bin\)


```bash 
mongod --dbpath "(medicalapp folder directory):/data"
```

Navigate to the medicalapp directory (the location where you unzip or git pull) 

```bash
npm install
node app 
```

Successful initialization
-------------

The following will be display on successful initialization 

```bash
Server started on port 5000
mongoDB Connected...
```
