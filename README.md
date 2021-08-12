# CourseApi

Backend coding test - 

To deploy locally use the below commands in sequance while in root directory
```
yarn install 
yarn start 
```

To run in dev
```
yarn install 
yarn dev 
```

To run tests
```
yarn test
```

To deploy on docker use the following
```
docker-compose build
docker-compose up
```

To deploy to AWS using AWS-CLI and Docker 
This was done quickly its not ideal / secure docker hub image is public. In a real environment this would be self hosted. 

Prerequisite 

Please setup IAM user with permissions on https://docs.docker.com/cloud/ecs-integration/

```
docker context create ecs courseapp
  - an existing AWS profile
  - default

docker context use courseapp
docker compose up
``
