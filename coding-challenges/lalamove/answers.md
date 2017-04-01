# Lalamove Technical Challenge

Firstly, I want to highlight that I only allocated a majority of Thursday afternoon to both challenge myself, as well as this week being somewhat tight with time due to HackTrain HK and HKWD (I was prepping a talk).

OK let's get into it.

### Part 1:
Handle Spikes:

Using autoscaling/devops to evenly distribute load across node instances. 
Will supply additional pen/paper solution in attachment.

### Part 2:

Tasks:
- New Order Allocation
- Driver Filter 
- Order Retrieval

High-level Overview:
I want to start to discuss the high level overview of the business use case for Lalamove before I go into the technical challenges.

Lalamove's core business is extremely time sensitive. (both on the User side; submitting orders, as well as the Driver side; receiving orders, confirming tasks and location based data).

Therefore how we need to understand the criteria of how we implement a specific solution.

Let's lay out some assumptions:
1. Connection issues between User/Driver to Lalamove's Server. (Connection Dropout, Poor Signal, Disconnection, Slow Speed, etc)
2. Amount of User/Driver's online, how do we handle messaging, do we split the services that handle very specific tasks?

### New Order Allocation

We have to view this problem as a many supplier vs. many consumer and the problem of resource allocation.

Let's simplify the problem:
Say there are many consumers (they want access to a resource), but there is only one supply

e.g. 
In-between many towns, there is one coal finite mine.
Who gets what and when?

When we define a scenario of resource; especially with a constraint with time, we need to think about a Queue.

There are many different types of Queues, however, the one that interests us, is the First In First Out Queue (FIFO).

Here, whoever submits their order into the queue first, will be the first person to have their order satisified by the resource supply.

In our originally context, we are looking at Drivers as people who want to be submitted into the Queue and they are waiting for orders from Users within a defined criteria (this would be distance).

How we can implement a Queue in JS, for example would be viewed as an Array type data structure.

```
var JobQueue = []; // Queue has no jobs
var OnlineDriverQueue = [...manyDrivers]; // DriverQueue with many Drivers
```
// We could optimise Filter Driver by separating online drivers into buckets, but more on that later.
(See Driver Filter).

When a user comes online, they will ping the server to say that they are online. Then the user will submit an order with a client-side timeout of time X. If an appropriate reponse has not returned by the server, the user should retry to submit the order. This is particularly import if the client has a slow or weak internet connection.

The order will try to submit an order to the server, where it will be pushed into the JobQueue.

When JobQueue has been submitted, we can then execute a filter function to first find the closest online drivers (sorted by their position in the OnlineDriver Queue) and allocate accordingly.

From there, the server will ask the Driver for a confirmation if they would like to accept the order. Here set a connection time out of time Y. If the timeout of Y is exceeded (possibly disconnection, poor connection, or simply that the Driver didn't respond quick enough), the Driver in the queue should be shifted out of the current position (until they are reconnected), such that the next Driver is allocated the User Order.

             { X Time }
[ User ]   ------------> [ Server ]
                           |
                           |     add to Jobqueue
                           | (find first/closest driver from OnlineDriverQueue)
             { Y Time }    v
[ Driver ] <------------ [ Server ]

The previous implementation is an example of FIFO with sent at-least-once (rather than executed at-most-once). The latter example is more important in the case study of say, processing a financial payment (you don't want to charge the client twice; simply abort the action if no response and ask the user to re-submit the transaction payment).

Now I've purposefully kept the implementation somewhat vague, as the process of reallocation could be done via an Array structure above

```
var jobQueue = [];
```

and you could 'simply' use JS native functions to `.push()` and `.shift()` data objects from the queue when required.

But does this implementation scale, what about maintaining a sense of immutability within the Queue data Structure?, how about type checking (such that a specific data structure is only allowed within the Queue?);
How would we solve this?

We could implemnt type-checking via immutable.js or verifying the type of data object that is being included into the Queue Array.
Let's assume that isn't a concern right now (though it is when we're trying to scale for performance and maintability). 

We could also implement an Observer emitter pattern within the jobQueue (as a version 2), which tells a central dispatcher to go and find the nearest Driver.

So our architecture would look like thus:

             { X Time }
[ User ]   ------------> [ Server ]
                           |
                           | JobQ = [];
                           | DriverQueue = [1,2,3];
                           |  
                           | JobQ.addjob(newJob); // jobQ = [newJob]
                           | JobQ.addjob = function(job) { observer.emit('add job', job) }
                           | 
                           | // this listens to when jobs are added 
                           | // and tries to find and assign a driver from the DriverQueue
                           | // it then waits for a confirmation before dropping the Driver if they don't respond
                           | 
                           | Dispatch.on('add job', 
                                (job)=>{ fetchAndAssign({ DriverQueue, job }), 
                                  ()=>{ waitforconfirmationOrDrop(); } });
                           | 
             { Y Time }    v
[ Driver ] <------------ [ Server ]


what we haven't discussed is this part
```
Dispatch.on('add job', (job)=>{ 
  fetchAndAssign({ DriverQueue, job }, ()=>{ waitforconfirmationOrDrop(); } 
});
```

when adding a job, the observer should be given the job that's been added. the next part should be to fetch the DriverQueue with the given job, which returns a callback function.
In the callback function, we're determining whether the job should be reassigned and/or the driver should be repositioned in the DriverQueue.
the `waitForConfirmationOrDrop()` should also account for time Y that we discussed earlier.

To summarsize - I've mentioned the messaging between the User and the Driver is driven between the Server, which acts as a messaging broker/dispatch which determines the position of the job and driver relative to the time when they joined the Queue. This is particularly important, when we want to maintain some sense of consistency for our Users/Drivers to retain their their usage.
the final aspect that should be considered is how this problem set is similar in some respects to the "Two Generals" CS problem, whereby the application/algo acts as a the broker between both parties, and some actions (such as confirmation from the Driver) may need some action to confirm their availability to accept a Job.

Now, in terms of logictics, what problems does a "driver must accept" create?

If a Driver must accept a job, then they need to physically touch the phone, which is problematic. (also legal issues as well) - Therefore, we "could" assume that order allocation is "given", and determine if the driver is still connected and headed to the job location, then the driver as assumed the job. (however, this may cause some problems as it assumes a level of trust that all drivers on the platform must accept the job, rather than say, accepting jobs based on proximity and preference).

In other aspects of the implementation, we could asssume that we could use third-party message broker implementations such as Message Queues like AWS SQS, RabbitMQ or Azure Queues as an example. each with their own particular set of quirks to implement (I will not go inot that right now).

If we aim to distribute the message broker, we could spawn multiple instances of the algorithm based on locale, or within specific parts of a city (say regions that only deal with longer transit, or based on driver filter). Here, we may need to invesitgate how we maintain insfrastructure debugging as well as zero-down-time instances. (leveraging AWS or other hosting provider tools).

In respect of time Y - there is one thing to  note, we would probably not want to use setTimeout, but rather `req.socket.setTimeout(Y)` or something appropriate to that affect, since we don't want to wait for total time Y, if the Driver has disconnected within that time.


## Onto the next part. Driver Filter

With Driver filter, we can use a similar principal with dispatch in the above example, whereable the Dispatch uses `DriverQueue.filter(filterobject)`. However, if DriverQueue is incredibly large, how do we optimize this piece of code?
We could loop through the DriverQueue and retrieve the `filterObject` iteratively with a filtered Array using push such that 

```
var VansQueue = [];
var DriverQueue = [...manyDrivers];

var vanFilterObject = { // data to get a van }

DriverQueue.forEach((item)=>{
  if (item === vanFilterObject) {
    VansQueue.push(item);
  }
});
```
but is this the most effective way to distrbute Drivers? 
I suppose it doesn't, since it doesn't account for the addition to new Drivers (or disconnected drivers) from the filtered Queue. We could use a Observer pattern to update the filtered Queue, that way we don't have to constantly rebuild the Queue Array.

Another aspect, is that, if we distribute the DriverQueue into smaller Queues?
The first idea that comes to mind is that, if the filteredQueue has found atleast one or a few matching drivers, then there is no need to iterate over the entire DriverQueue.

The other aspect that comes to mind is that, you "could", create buckets that are associated with specific regions on the geographical map (like zones/sectors), and whenever there is nothing found in the immediate vicinity, you could concat nearby filterQueues which may save some operational time.

I suppose the trade off may be a heavier load on memory if we 'pre-define' specific regions. (I'm undecided on this, but would probably discuss this with a colleague on my thought process).

## Order Retrival

There are two thoughts that come to mind.
1. this could assume the way that orders are retrieved via a distrubuted model for a dispatch service to allocate orders to drivers.

2. this could be associated to when the driver has confirmed being allocated a job, and is going to pick up the order (at starting point and heading to final destination).

I'm not going to tackle part onesince I feel this could be handled with a similar pattern to above solutions/ideas


<!-- 1. 
The first thought that comes to mind, is that this seems deceptively simple.

Why? 
First of all, I'm assuming that the orders are being submitted to one central location from the user. 
But what if the current implementation of Order Submission is distributed?

hmm...

Let's assume that the orders are being submitted into a distributed collection (sometimes in bucket 1 or bucket 2 up to bucket N).
What advantage does this provide? -->

### Tackling problem 2.

Lets assume that the above allocation has been successful on behalf of the driver.

What information will I need?

- Location data of the Driver on route to the client specified starting point.
- Contact information to be provided to the Driver for point of contact.
- The user needs the Driver information that has confirmed to accept the order.
- The quickest route from the Driver's location to the starting point (which will be updated depending on the driver's route).

### Possible order of operations
pre-1. (determine toll data for user if generating routes with timeframe)

1. confirmation from driver to accept order

// should happen at the same/similar time
2.1 generate quickest route for driver using map/traffic data (could be done on frontend via Driver app)
2.2 ping driver details to user

3. send location data from driver to user 

// user app is polling depending on connectivity strength. 
// debounce driver location (actually what happens if the driver gets into an accident?)

3.1 (listen for cancellation if applicable, apply appropriate fees/actions to respective user)

4. when driver is near location, either ping user or send SMS via contact details at delivery. (could be same as user, or user submitted data, may optionally ping user if driver has arrived).

// need a hook for SMS transport (say twilio or may your own via arduino for example); could be email, imessage, or just push notification to respective User app.

4.1 Await confirmation from arrival of package via delivery confirmation code/Qrcode, signature, payment.

5. update status of successful delivery. (two successes from user/delivery or simply via driver, could contest if user has confirmed problem with delivery [need more operational info])

5.1 Ask for review of driver via rating system, optionally ask if they wish to add to preferred fleet. (UI on frontend, update user preferences and driver stats on backend)
5.2. Send notification to both driver and user of payment transaction for successful delivery. (handle payment via deduction within USer wallet to be transferred to Driver)

6. Add driver back to Queue.

---
Time spent for Part 2. 3 Hours (typing)