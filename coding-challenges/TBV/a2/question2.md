Question 2:

Describe ​how you would structure a service architecture to handle a Facebook friend story feed / twitter feed, with 10,000 new updates per second and handle the display to 1M concurrent users.

- What can be done for optimal performance on client end

­- How should the messages be distributed between clients, servers and  databases

- ­How would the data be stored

- ­How can the response time be kept short for client requests

- ­What kind of hardware would you expect to use

- ­How can the service be kept up during earthquakes


# Client Performance

First of all, in terms of architecture, I won't go into too much detail in regards to front-end development optimisation (primarily,  related to minification or number of requests to render the page). I shall highlight some points to give an overview as a means for client side optimisation.

- Minification of assets/concatination of multiple files (example serving one stylesheet/js file, [bundle])
- Using CDN for static assets (with hashsum/versioning for incremental changes/improvements)
- Web workers (on web) for offline rendering [Google I/O talk](https://www.youtube.com/watch?v=cmGr0RszHc8)
- Only requesting the appropriate asset when required (Webpack/lazy loading)


### Higher level 

- Caching (Browser level or Server level memcache/redis/couchbase as examples [only used redis in a technical challenge])
- HTTP/2 protocol (can serve assets concurrently [JsConf.Asia2015](https://www.youtube.com/watch?v=i2ezuw_RV78))
- Locating servers closer to client base (implementing multiple locations/instances/regions [can't think of appropriate term to describe a collection of multiple servers in same location])
- Leveraing top tier web services with reliable and tolerant infrastucture ()
- For architecture, we may need to manage deployment on different environments, regions and servers. Using an orchestration tool (docker swarm, kubernates, puppet, ansible etc) will be beneficial, as well as automated tests/CI tooling.

# Distrubution of messages

[Preface, limited experience, but only know the high level concepts]

Having a messaging broker/queue service (RabbitMq, AWS SQS, and others). Connecting to server via sockets (firebase/horizon/parse implementations).

# How should data be stored

If the data is straight forward, i.e. has a set relationship schema. e.g.

    Message Schema
      id: MessageId
      user: UserId
      message: String
      dateCreatedAt: dateString|IsoString
      dateModifiedAt: dateString|IsoString
      dateDeletedAt: dateString|IsoString
      etc

this is fine... but what happens if the contraints of the data would be further expanded to accomodate unknown features/use cases (likes, references, links, further threads/nested data).
I suppose having a non-relational database would be better, but this increases the complexity to the point that it would increase the technical demands on hardware/information stack. 

# Decreasing Response Time

Depending on the service stack (per instance), leveraging best practices on technology stack (maximising concurrency, streams, sharding, replication, load balancing).

Apart from the best practices from the frontend, the aim here is to decrease latency between the various services that are being called upon by the client. In this case, decreasing the latency with regional location is paramount, (same geolocation, or machine), using reliable infrastructure providers (etc).

# Hardware

If we used a microservice architecture, then the requires per server would be different. Example; a cache server would require more Memory than say Harddisk space, (priority on read rate).

Application Server
Caching Server
Messaging Broker
Load Balancing
Monitoring Server (listens to all parts of architecture, either ping or writes logs for debugging)

# Disaster scenario

Ensuring the service is running in terms of a geolocated natural disaster can be achieved by installing multiple instances in different locations. (Netflix/AWS/Google AppEngine), relying on a single provider is a risky endeavour (incase of system faults on that provider). 

Recall remembering [Netflix](http://techblog.netflix.com/2011/04/lessons-netflix-learned-from-aws-outage.html) experience as a point of reference

If the event of all commercial use cases have been accounted for, using alternative strategies (internet.org freebasics).