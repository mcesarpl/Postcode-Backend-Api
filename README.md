# We are excited you are taking the time to solve our technical assignment! #

### Let’s pretend you are starting your first day with us. After you settle in, your first task will be assigned. Both Joseph (Product Owner) and Ness (Technical Lead) are ready to give you more details on your first task. ###

> Joseph - “Hi, I have your first task, excited?

> We need to create a web application that allows you to find the addresses of our customers based on their postcodes. Multiple addresses will be searched, so it would be nice if we could add the history of the last 3 in the page. Finally, alongside the address, we need to display the distance in a straight line, from the customer location to London Heathrow airport (lat/long: 51.4700223,-0.4542955) this should be displayed in both kilometers and miles.”

> Ness - “Ok, I understand the request and I think I can provide some help. I’ve heard about https://postcodes.io/, and we can use it as web service where we can type the postcode and we get the address details back, alongside the latitude and longitude. As its straight line it should be very easy to calculate the distance between the airport and the customer address.

### A working example for the web service is: http://api.postcodes.io/postcodes/N76RS

## A few examples of valid postcodes in the UK are:

| Index    | Postcode |          |
|----------|----------|----------|
| #1       | N76RS    |          |
| #2       | SW46TA   |          |
| #3       | SW1A     |          |
| #4       | W1B3AG   |          |
| #5       | PO63TD   |          |

     
	     
		 

I think a NodeJS application would be an excellent idea. There are definitely benefits to it but feel free to use other technologies/frameworks. Obviously if you want to use other frontend tools/technologies to help you achieve the work, I’m happy with it, but remember the focus must be as much in having it working as it should to have a good user experience, bonus points if you are able to produce a mockup and explain the reason why you used certain components. It is important the user understands all the functionalities we have to offer and is able to understand them correctly

Once you are done please commit the code and create a Pull Request so we can code review it.”

Now that the exercise has been explained, you can start working on it, we normally request for it to be uploaded into our git repository within 3 working days, but can be changed if you need more time to start. This task should take you no longer than 3 hours and needless to say should be totally completed by you, after all this is supposed to be a fun challenge! 

---

## We will provide you a git repository in bitbucket for the code to be uploaded. Please see the instructions below:

Please sign up for an account on Bitbucket if you don't have one already. If you do, feel free to use your own login / profile.

If you're not familiar with GIT, use the Sourcetree client to get started or visit http://git-scm.com for the official git client.

Once you're done with your work, COMMIT and then PUSH (ie. send to bitbucket). The PUSH with notify us and we will review your work. Only push when you're done, and push once. This is to avoid us reviewing an incomplete submission.

---

### We're here to help...
Should you run into problems or have any questions - please get in touch with either your recruitment agent or with Renato Oliveira - renato.oliveira@craftablesoftware.com

Good luck

# Backend Solution Proposal

This Rest API build based on [Express](https://www.npmjs.com/package/express) is the backend proposal to manage different online unsigned clients ( no logging necessary ) making requests with postcodes in order the retrieve their addresses. For each client a 1 hour session is generated, and up to the last three request responses made before are returned for each new request made. Above is the top level architecture of the API. 

![Top-Level](/documents/figures/top-level.png "Top Level Architecture")

It was used the pattern [Adapter](https://refactoring.guru/pt-br/design-patterns/adapter) to decouple the use of database and Http Client libraries into the main service, here being available for use the [Redis](https://redis.io/docs/stack/get-started/tutorials/stack-node/) database client and [Axios](https://www.npmjs.com/package/axios) Http client.

The design patterns [FactoryMethod](https://refactoring.guru/pt-br/design-patterns/factory-method) and [Facade](https://refactoring.guru/pt-br/design-) were also used. The concept of [Dependency Injection](https://martinfowler.com/articles/injection.html) was applied. In addition, it was developed with [Automated Tests](https://www.davidbaumgold.com/tutorials/automated-tests-node/) using the [Jest](https://jestjs.io/pt-BR/) library for the creation, simulation and execution of tests.

The project also has a log service using [Winston](https://www.npmjs.com/package/winston) and [Elasticsearch](https://www.elastic.co/pt/whatis/elasticsearch), being possible to view the logs through [Kibana](https://www.elastic.co/pt/kibana/). Both are available for development environment through [Docker](https://www.docker.com/).

# Technologies

The project uses the following technologies:</br>
[NodeJs](https://nodejs.org/en/)</br>
[Ts-Node](https://github.com/TypeStrong/ts-node)</br>
[Typescript](https://www.typescriptlang.org/)</br>
[Express](https://www.npmjs.com/package/express)</br>
[GeoLib](https://www.npmjs.com/package/geolib)</br>
[Cors](https://www.npmjs.com/package/cors)</br>
[Winston](https://www.npmjs.com/package/winston)</br>
[Jest](https://jestjs.io/pt-BR/)</br>
[Ts-Jest](https://github.com/kulshekhar/ts-jest)</br>
[Redis](https://redis.io/docs/stack/get-started/tutorials/stack-node/)</br>
[Eslint](https://eslint.org/)</br>
[Express-Rate-Limit](https://www.npmjs.com/package/express-rate-limit)</br>
[http-status-codes](https://www.npmjs.com/package/http-status-codes)</br>
[Elasticsearch](https://www.elastic.co/pt/what-is/elasticsearch)</br>
[Kibana](https://www.elastic.co/pt/kibana/)</br>
[Docker](https://www.docker.com/)</br>
[Config](https://www.npmjs.com/package/config)</br>


# Main Throughput Solution

![Cache-Solution](/documents/figures/cache-solution.png "Cache Solution")

No only client sessions are been stored in Cache. In order to enhance the throughput capabilities, a cache architecture solution was applied. For every postcode researched on API the first check is if this postcode was researched previously, and if the answer is still save on cache, in this case, Redis. This solution not only give the client a faster answer, but also lower the amount of request made for a third party client. An expiration time of 1 hour was set the development and test proposals, but probably it would be necessary a better tunning in an production scenario.

# Installation local environment

- Make Elasticsearch, Kibana and Redis services available

```
  $ docker-compose up --build -d
```
- ( for WSL environment) You might need to free more space on docker to run Elastic,
in this case use the command below and restart the container:
```
  $  wsl -d docker-desktop
  $  sysctl -w vm.max_map_count=262144
  $  exit
```
- To install all project dependencies

```
  $ npm install
```

- To run the project in dev environment

```
  $ npm run dev
```

The main API port will be available on the port **80**

# Use Cases

## Routes

----
- [GET  /health](/documents/markdown/health.md)
- [GET  /postcode/:code](/documents/markdown/find-address.md)

---
</br>


