Technical Challenge

Case Study:
Lalamove is a last-minute intra-city delivery technology in Asia. We have thousands of drivers in the system for a single city (we are in more than 25 cities in Asia), and every minute we have thousands of drivers online each with different attributes, such as vehicle size, their location, whether or not they are able to deliver food, etc. 

When an order is placed (and comes to our system), we screen out the suitable drivers and dispatch order to them. Their phone will then retrieve an order list from our servers. Therefore, on the Driver side  
- They are constantly refreshing and asking for an updated order list (we work on a first come first serve basis)
- They are constantly sending out their location to our server (order dispatch algorithm dispatches to drivers in batches; it begins dispatching to the closest drivers first and then continues to expand the range)
- Each driver has a different attribute only fit to a specific order
- Each driver receives thousands of push notifications every day

User side
-Users are constantly requesting information about their order

Technical Challenge
In some scenarios, it is easy for the system to hit a spike causing a lot of issues on our database. Therefore, in this challenge, there are two parts
1. Part 1 (less than 2 hours)
Design, with pen and paper, at a high level what the system should look like to handle these spikes 
2. Part 2 (~ 20 hours)
Suggest and design either a new order allocation algorithm OR driver filter algorithm OR order retrieval algorithm to solve the problem. We are primarily looking to see your train of thought as well as coding style. Please note that you are not required to finish the code if you run out of time, but we recommend that you write out your thought process when you submit this assignment. 

Please note that communication is also something we consider in this technical challenge and in our developers. We have intentionally made the question very high level to allow the candidate to pick the area that they want to focus on. ~~If you have any questions, please feel free to reach out to the following contact information:~~